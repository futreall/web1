import { clearAssets } from './clearAssets'
import { clearMarketData } from './clearMarketData'
import { clearNfts } from './clearNfts'
import { clearOpportunities } from './clearOpportunities'
import { clearPortfolio } from './clearPortfolio'
import { clearTxHistory } from './clearTxHistory'

export const migrations = {
  0: clearOpportunities,
  1: clearOpportunities,
  2: clearPortfolio,
  3: clearOpportunities,
  4: clearOpportunities,
  5: clearNfts,
  6: clearAssets,
  7: clearPortfolio,
  8: clearOpportunities,
  9: clearAssets,
  10: clearTxHistory,
  11: clearAssets,
  12: clearAssets,
  13: clearPortfolio,
  14: clearTxHistory,
  15: clearAssets,
  16: clearOpportunities,
  17: clearTxHistory,
  18: clearTxHistory,
  19: clearMarketData,
}
