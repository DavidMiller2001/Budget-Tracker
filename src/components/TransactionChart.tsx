import { Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { TransactionChartDataType } from '#/routes'

const transactionChartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function TransactionChart(props: {
  transactionData: { type: TransactionChartDataType; amount: number }[]
}) {
  const { transactionData } = props

  // Aggregate totals
  const incomeTotal = transactionData
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseTotal = transactionData
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Final chart data
  const chartData = [
    {
      type: 'Income',
      amount: incomeTotal,
      fill: '#22c55e',
    },
    {
      type: 'Expense',
      amount: expenseTotal,
      fill: '#ef4444',
    },
  ]

  return (
    <ChartContainer
      config={transactionChartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="type"
          innerRadius={30} // donut chart
          outerRadius={90}
          strokeWidth={2}
          label
        />
      </PieChart>
    </ChartContainer>
  )
}
