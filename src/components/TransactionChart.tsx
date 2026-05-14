import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '#/lib/utils'

const transactionChartConfig = {
  income: {
    label: 'Income',
  },
  expense: {
    label: 'Expense',
  },
} satisfies ChartConfig

export function TransactionChart(props: {
  transactionData: { type: string; amount: number }[]
}) {
  const { transactionData } = props

  // Aggregate totals
  const incomeTotal = transactionData
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseTotal = transactionData
    .filter((t) => t.type !== 'Income')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = incomeTotal - expenseTotal

  // Final chart data
  const chartData = [
    {
      type: 'Income',
      amount: incomeTotal,
      fill: 'var(--primary)',
    },
    {
      type: 'Expense',
      amount: expenseTotal,
      fill: 'var(--destructive)',
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
          innerRadius={50} // donut chart
          outerRadius={90}
          strokeWidth={2}
          label
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={cn(
                        'text-3xl font-bold',
                        balance < 0 ? 'fill-destructive' : 'fill-primary',
                      )}
                    >
                      {`$${incomeTotal - expenseTotal}`}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Balance
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
