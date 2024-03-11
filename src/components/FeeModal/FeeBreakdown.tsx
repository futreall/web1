import { Divider, Heading, Stack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { Amount } from 'components/Amount/Amount'
import { Row } from 'components/Row/Row'
import { RawText, Text } from 'components/Text'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { calculateFees } from 'lib/fees/model'
import type { ParameterModel } from 'lib/fees/parameters/types'
import { selectVotingPower } from 'state/apis/snapshot/selectors'
import { useAppSelector } from 'state/store'

const divider = <Divider />

const AmountOrFree = ({ isFree, amountUSD }: { isFree: boolean; amountUSD: string }) => {
  return isFree ? (
    <Text translation='common.free' color='text.success' />
  ) : (
    <Amount.Fiat fiatType='USD' value={amountUSD} />
  )
}

type FeeBreakdownProps = {
  feeModel: ParameterModel
  inputAmountUsd: string | undefined
  affiliateFeeAmountUsd: string
}

export const FeeBreakdown = ({
  feeModel,
  inputAmountUsd,
  affiliateFeeAmountUsd,
}: FeeBreakdownProps) => {
  const translate = useTranslate()
  const votingPowerParams: { feeModel: ParameterModel } = useMemo(() => ({ feeModel }), [feeModel])
  const votingPower = useAppSelector(state => selectVotingPower(state, votingPowerParams))
  const { foxDiscountUsd, foxDiscountPercent, feeUsdBeforeDiscount, feeBpsBeforeDiscount } =
    calculateFees({
      tradeAmountUsd: bnOrZero(inputAmountUsd),
      foxHeld: votingPower !== undefined ? bn(votingPower) : undefined,
      feeModel,
    })

  const isFree = useMemo(() => bnOrZero(affiliateFeeAmountUsd).eq(0), [affiliateFeeAmountUsd])

  const isFeeUnsupported = useMemo(() => {
    return affiliateFeeAmountUsd === '0' && bnOrZero(feeUsdBeforeDiscount).gt(0)
  }, [affiliateFeeAmountUsd, feeUsdBeforeDiscount])

  const feeDiscountUsd = useMemo(() => {
    return isFeeUnsupported ? '0.00' : foxDiscountUsd.toFixed(2)
  }, [foxDiscountUsd, isFeeUnsupported])

  return (
    <Stack spacing={0}>
      <Stack spacing={2} px={8} pt={8} mb={8}>
        <Heading as='h5'>{translate('foxDiscounts.breakdownHeader')}</Heading>
        <RawText color='text.subtle'>{translate('foxDiscounts.breakdownBody')}</RawText>
      </Stack>
      <Stack px={8} mb={6} spacing={4} divider={divider}>
        <Row>
          <Row.Label>{translate('foxDiscounts.tradeFee')}</Row.Label>
          <Row.Value textAlign='right'>
            <AmountOrFree isFree={isFeeUnsupported} amountUSD={feeUsdBeforeDiscount.toFixed(2)} />
            <Amount
              color='text.subtle'
              fontSize='sm'
              value={isFree ? '0' : feeBpsBeforeDiscount}
              suffix='bps'
            />
          </Row.Value>
        </Row>
        <Row>
          <Row.Label>{translate('foxDiscounts.currentFoxPower')}</Row.Label>
          <Row.Value textAlign='right'>
            <Amount.Crypto value={votingPower ?? '0'} symbol='FOX' maximumFractionDigits={0} />
          </Row.Value>
        </Row>
        {!isFeeUnsupported && (
          <Row>
            <Row.Label>{translate('foxDiscounts.foxPowerDiscount')}</Row.Label>
            <Row.Value textAlign='right'>
              <Amount.Fiat fiatType='USD' value={feeDiscountUsd} />
              <Amount.Percent
                fontSize='sm'
                value={isFree ? 1 : foxDiscountPercent.div(100).toNumber()}
                color='text.success'
              />
            </Row.Value>
          </Row>
        )}
      </Stack>
      <Divider />
      <Row px={8} py={4}>
        <Row.Label color='text.base'>{translate('foxDiscounts.totalTradeFee')}</Row.Label>
        <Row.Value fontSize='lg'>
          <AmountOrFree isFree={isFree} amountUSD={affiliateFeeAmountUsd} />
        </Row.Value>
      </Row>
    </Stack>
  )
}
