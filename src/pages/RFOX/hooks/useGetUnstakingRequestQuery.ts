import { skipToken } from '@tanstack/react-query'
import { foxStakingV1Abi } from 'contracts/abis/FoxStakingV1'
import { RFOX_PROXY_CONTRACT_ADDRESS } from 'contracts/constants'
import { useMemo } from 'react'
import { type Address, getAddress, type MulticallReturnType } from 'viem'
import { multicall } from 'viem/actions'
import { arbitrum } from 'viem/chains'
import type { Config } from 'wagmi'
import { type ReadContractsQueryKey, useQuery } from 'wagmi/query'
import { isSome } from 'lib/utils'
import { viemClientByNetworkId } from 'lib/viem-client'

import { useGetUnstakingRequestCountQuery } from './useGetUnstakingRequestCountQuery'

type AllowFailure = false

const getContracts = (stakingAssetAccountAddress: string | undefined, count: bigint) =>
  stakingAssetAccountAddress
    ? Array.from(
        { length: Number(count) },
        (_, index) =>
          ({
            abi: foxStakingV1Abi,
            address: RFOX_PROXY_CONTRACT_ADDRESS,
            functionName: 'getUnstakingRequest',
            args: [getAddress(stakingAssetAccountAddress), BigInt(index)],
            chainId: arbitrum.id,
          }) as const,
      )
    : []

type GetContractsReturnType = ReturnType<typeof getContracts>

type GetUnstakingRequestQueryKey = ReadContractsQueryKey<[Address, bigint], AllowFailure, Config>

type UnstakingRequest = MulticallReturnType<GetContractsReturnType, AllowFailure>

type UseGetUnstakingRequestQueryProps<SelectData = UnstakingRequest> = {
  stakingAssetAccountAddress: string | undefined
  select?: (unstakingRequest: UnstakingRequest) => SelectData
}

const client = viemClientByNetworkId[arbitrum.id]

export const useGetUnstakingRequestQuery = <SelectData = UnstakingRequest>({
  stakingAssetAccountAddress,
  select,
}: UseGetUnstakingRequestQueryProps<SelectData>) => {
  const {
    data: unstakingRequestCountResponse,
    isError: isUnstakingRequestCountError,
    isLoading: isUnstakingRequestCountLoading,
    isPending: isUnstakingRequestCountPending,
    error: unstakingRequestCountError,
  } = useGetUnstakingRequestCountQuery({
    stakingAssetAccountAddress,
  })

  const contracts = useMemo(
    () => getContracts(stakingAssetAccountAddress, unstakingRequestCountResponse ?? 0n),
    [stakingAssetAccountAddress, unstakingRequestCountResponse],
  )

  // wagmi doesn't expose queryFn, so we reconstruct the queryKey and queryFn ourselves to leverage skipToken type safety
  const queryKey: GetUnstakingRequestQueryKey = useMemo(
    () => [
      'readContracts',
      {
        contracts,
      },
    ],
    [contracts],
  )

  const getUnstakingRequestQueryFn = useMemo(() => {
    // Unstaking request count is actually loading/pending, fine not to fire a *query* for unstaking request here just yet and skipToken
    // this query will be in pending state, which is correct.
    if (isUnstakingRequestCountLoading || isUnstakingRequestCountPending) return skipToken
    // We have an error in unstaking request count- no point to fire a query for unstaking request, but we can't simply skipToken either - else this query would be in a perma-pending state
    // until staleTime/gcTime elapses on the dependant query. Propagates the error instead.
    if (isUnstakingRequestCountError) return () => Promise.reject(unstakingRequestCountError)
    // We have a successful response for unstaking request count, but it's a 0-count.
    // We don't need to fire an *XHR* as we already know what the response would be (an empty array), but still need to fire a *query*, resolving immediately with said known response.
    if (unstakingRequestCountResponse === 0n) return () => Promise.resolve([])

    return () =>
      multicall(client, {
        contracts,
      }).then(r => r.map(response => response.result).filter(isSome))
  }, [
    contracts,
    isUnstakingRequestCountError,
    isUnstakingRequestCountLoading,
    isUnstakingRequestCountPending,
    unstakingRequestCountError,
    unstakingRequestCountResponse,
  ])

  const unstakingRequestQuery = useQuery({
    queryKey,
    queryFn: getUnstakingRequestQueryFn,
    select,
    retry: false,
  })

  return unstakingRequestQuery
}
