import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '#/lib/utils'
import type { categories } from '#/db/schema'

const transactionChartConfig = {
  income: {
    label: 'Income',
  },
  bill: {
    label: 'Bills',
  },
  food: {
    label: 'Food',
  },
  entertainment: {
    label: 'Entertainment',
  },
  other: {
    label: 'Other',
  },
} satisfies ChartConfig

export function TransactionChart(props: {
  transactionData: { category: (typeof categories)[number]; amount: number }[]
}) {
  const { transactionData } = props

  // Aggregate totals
  let incomeTotal = 0
  let expenseTotal = 0
  let billTotal = 0
  let foodTotal = 0
  let entertainmentTotal = 0
  let otherTotal = 0

  transactionData.forEach((t) => {
    switch (t.category) {
      case 'Income':
        incomeTotal += t.amount
        break
      case 'Bill':
        billTotal += t.amount
        expenseTotal += t.amount
        break
      case 'Food':
        foodTotal += t.amount
        expenseTotal += t.amount
        break
      case 'Entertainment':
        entertainmentTotal += t.amount
        expenseTotal += t.amount
        break
      default:
        otherTotal += t.amount
        expenseTotal += t.amount
    }
  })

  const balance = incomeTotal - expenseTotal

  // Final chart data
  const chartData = [
    {
      category: 'Income',
      amount: incomeTotal,
      fill: 'var(--primary)',
    },
    {
      category: 'Bills',
      amount: billTotal,
      fill: 'var(--destructive)',
    },
    {
      category: 'Food',
      amount: foodTotal,
      fill: 'var(--food-color)',
    },
    {
      category: 'Entertainment',
      amount: entertainmentTotal,
      fill: 'var(--entertainment-color)',
    },
    {
      category: 'Other',
      amount: otherTotal,
      fill: 'var(--other-color)',
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
          nameKey="category"
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
