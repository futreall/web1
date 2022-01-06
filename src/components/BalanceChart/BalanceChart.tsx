import { CAIP19 } from '@shapeshiftoss/caip'
import { HistoryTimeframe } from '@shapeshiftoss/types'
import { useEffect } from 'react'
import { Card } from 'components/Card/Card'
import { Graph } from 'components/Graph/Graph'
import { useBalanceChartData } from 'hooks/useBalanceChartData/useBalanceChartData'
import { calculatePercentChange } from 'lib/charts'

type BalanceChartArgs = {
  assetIds: CAIP19[]
  timeframe: HistoryTimeframe
  percentChange: number
  setPercentChange: (percentChange: number) => void
}

export const BalanceChart: React.FC<BalanceChartArgs> = ({
  assetIds,
  timeframe,
  percentChange,
  setPercentChange
}) => {
  const { balanceChartData, balanceChartDataLoading } = useBalanceChartData({
    assetIds,
    timeframe
  })

  useEffect(
    () => setPercentChange(calculatePercentChange(balanceChartData)),
    [balanceChartData, setPercentChange]
  )

  const color = percentChange > 0 ? 'green.500' : 'red.500'

  return (
    <Card.Body p={0} height='350px'>
      <Graph
        color={color}
        data={balanceChartData}
        loading={balanceChartDataLoading}
        isLoaded={!balanceChartDataLoading}
      />
    </Card.Body>
  )
}
