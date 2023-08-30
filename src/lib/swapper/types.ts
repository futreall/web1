import type { AccountId, AssetId, ChainId, Nominal } from '@shapeshiftoss/caip'
import type { CosmosSdkChainId, EvmChainId, UtxoChainId } from '@shapeshiftoss/chain-adapters'
import type { HDWallet } from '@shapeshiftoss/hdwallet-core'
import type { UtxoAccountType } from '@shapeshiftoss/types'
import type { TxStatus } from '@shapeshiftoss/unchained-client'
import type { Result } from '@sniptt/monads'
import type { Asset } from 'lib/asset-service'
import type { PartialRecord } from 'lib/utils'
import type { ReduxState } from 'state/reducer'
import type { AccountMetadata } from 'state/slices/portfolioSlice/portfolioSliceCommon'

export type SwapErrorRight = {
  name: 'SwapError'
  message: string
  cause?: unknown
  details?: unknown
  code?: SwapErrorType
}

export type UtxoFeeData = {
  byteCount: string
  satsPerByte: string
}

export type CosmosSdkFeeData = {
  estimatedGasCryptoBaseUnit: string
}

export type ProtocolFee = { requiresBalance: boolean } & AmountDisplayMeta

export type QuoteFeeData = {
  networkFeeCryptoBaseUnit: string | undefined // fee paid to the network from the fee asset (undefined if unknown)
  protocolFees: PartialRecord<AssetId, ProtocolFee> // fee(s) paid to the protocol(s)
  chainSpecific?: UtxoFeeData | CosmosSdkFeeData
}

export type BuyAssetBySellIdInput = {
  sellAsset: Asset
  assets: Asset[]
}

type CommonTradeInput = {
  sellAsset: Asset
  buyAsset: Asset
  sellAmountIncludingProtocolFeesCryptoBaseUnit: string
  sendAddress?: string
  receiveAddress: string
  accountNumber: number
  receiveAccountNumber?: number
  affiliateBps: string
  allowMultiHop: boolean
  slippageTolerancePercentage?: string
}

export type GetEvmTradeQuoteInput = CommonTradeInput & {
  chainId: EvmChainId
  supportsEIP1559: boolean
}

export type GetCosmosSdkTradeQuoteInput = CommonTradeInput & {
  chainId: CosmosSdkChainId
}

export type GetUtxoTradeQuoteInput = CommonTradeInput & {
  chainId: UtxoChainId
  accountType: UtxoAccountType
  accountNumber: number
  xpub: string
}

export type GetTradeQuoteInput =
  | GetUtxoTradeQuoteInput
  | GetEvmTradeQuoteInput
  | GetCosmosSdkTradeQuoteInput

export type AmountDisplayMeta = {
  amountCryptoBaseUnit: string
  asset: Partial<Asset> & Pick<Asset, 'symbol' | 'chainId' | 'precision'>
}

export type TradeQuoteStep = {
  buyAmountBeforeFeesCryptoBaseUnit: string
  buyAmountAfterFeesCryptoBaseUnit: string
  sellAmountIncludingProtocolFeesCryptoBaseUnit: string
  feeData: QuoteFeeData
  rate: string
  source: SwapSource
  buyAsset: Asset
  sellAsset: Asset
  accountNumber: number
  // describes intermediary asset and amount the user may end up with in the event of a trade
  // execution failure
  intermediaryTransactionOutputs?: AmountDisplayMeta[]
  allowanceContract: string
}

export type TradeQuote = {
  recommendedSlippage?: string
  estimatedExecutionTimeMs: number | undefined
  id: string
  steps: TradeQuoteStep[]
  rate: string // top-level rate for all steps (i.e. output amount / input amount)
  receiveAddress: string
  receiveAccountNumber?: number
  affiliateBps: string | undefined // undefined if affiliate fees aren't supported by the swapper
  isStreaming?: boolean
}

export type SwapSource = SwapperName | `${SwapperName} • ${string}`

export enum SwapperName {
  Thorchain = 'THORChain',
  CowSwap = 'CoW Swap',
  Zrx = '0x',
  Test = 'Test',
  LIFI = 'LI.FI',
  OneInch = '1INCH',
}

// Swap Errors
export enum SwapErrorType {
  BUILD_TRADE_FAILED = 'BUILD_TRADE_FAILED',
  EXECUTE_TRADE_FAILED = 'EXECUTE_TRADE_FAILED',
  MANAGER_ERROR = 'MANAGER_ERROR',
  MIN_MAX_FAILED = 'MIN_MAX_FAILED',
  RESPONSE_ERROR = 'RESPONSE_ERROR',
  SIGN_AND_BROADCAST_FAILED = 'SIGN_AND_BROADCAST_FAILED',
  TRADE_QUOTE_FAILED = 'TRADE_QUOTE_FAILED',
  TRADE_QUOTE_AMOUNT_TOO_SMALL = 'TRADE_QUOTE_AMOUNT_TOO_SMALL',
  TRADE_QUOTE_INPUT_LOWER_THAN_FEES = 'TRADE_QUOTE_INPUT_LOWER_THAN_FEES',
  UNSUPPORTED_PAIR = 'UNSUPPORTED_PAIR',
  USD_RATE_FAILED = 'USD_RATE_FAILED',
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  UNSUPPORTED_NAMESPACE = 'UNSUPPORTED_NAMESPACE',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  MAKE_MEMO_FAILED = 'MAKE_MEMO_FAILED',
  PRICE_RATIO_FAILED = 'PRICE_RATIO_FAILED',
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  GET_TRADE_TXS_FAILED = 'GET_TRADE_TXS_FAILED',
  TRADE_FAILED = 'TRADE_FAILED',
  RECEIVE_ACCOUNT_NUMBER_NOT_PROVIDED = 'RECEIVE_ACCOUNT_NUMBER_NOT_PROVIDED',
  // Catch-all for XHRs that can fail
  QUERY_FAILED = 'QUERY_FAILED',
  // Catch-all for missing input e.g AssetId missing when making a request
  MISSING_INPUT = 'MISSING_INPUT',
  // Catch-all for happy responses, but entity not found according to our criteria
  NOT_FOUND = 'NOT_FOUND',
  TRADING_HALTED = 'TRADING_HALTED',
}

export type FromOrXpub = { from: string; xpub?: never } | { from?: never; xpub: string }

export type GetUnsignedTxArgs = {
  tradeQuote: TradeQuote
  chainId: ChainId
  accountMetadata?: AccountMetadata
  stepIndex: number
  supportsEIP1559: boolean
  slippageTolerancePercentageDecimal: string
} & FromOrXpub

// the client should never need to know anything about this payload, and since it varies from
// swapper to swapper, the type is declared this way to prevent generics hell while ensuring the
// data originates from the correct place (assuming no casting).
export type UnsignedTx = Nominal<Record<string, any>, 'UnsignedTx'>

export type ExecuteTradeArgs = {
  txToSign: UnsignedTx
  wallet: HDWallet
  chainId: ChainId
}

export type CheckTradeStatusInput = {
  quoteId: string
  txHash: string
  chainId: ChainId
  stepIndex: number
  quoteSellAssetAccountId?: AccountId
  quoteBuyAssetAccountId?: AccountId
  getState: () => ReduxState
}

// a result containing all routes that were successfully generated, or an error in the case where
// no routes could be generated
type TradeQuoteResult = Result<TradeQuote[], SwapErrorRight>

export type Swapper = {
  filterAssetIdsBySellable: (assets: Asset[]) => Promise<AssetId[]>
  filterBuyAssetsBySellAssetId: (input: BuyAssetBySellIdInput) => Promise<AssetId[]>
  executeTrade: (executeTradeArgs: ExecuteTradeArgs) => Promise<string>
}

export type SwapperApi = {
  checkTradeStatus: (
    input: CheckTradeStatusInput,
  ) => Promise<{ status: TxStatus; buyTxHash: string | undefined; message: string | undefined }>
  getTradeQuote: (input: GetTradeQuoteInput) => Promise<TradeQuoteResult>
  getUnsignedTx(input: GetUnsignedTxArgs): Promise<UnsignedTx>
}

export type QuoteResult = Result<TradeQuote[], SwapErrorRight> & {
  swapperName: SwapperName
}

export type TradeExecutionInput = {
  swapperName: SwapperName
  tradeQuote: TradeQuote
  stepIndex: number
  accountMetadata: AccountMetadata
  quoteSellAssetAccountId: AccountId
  quoteBuyAssetAccountId: AccountId
  wallet: HDWallet
  supportsEIP1559: boolean
  slippageTolerancePercentageDecimal: string
  getState: () => ReduxState
}