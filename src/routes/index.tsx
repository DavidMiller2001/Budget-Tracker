import { TransactionChart } from '#/components/TransactionChart'
import {
  columns,
  TransactionDataTable,
} from '#/components/TransactionDataTable'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Plus } from 'lucide-react'
const getTransactions = createServerFn({ method: 'GET' }).handler(async () => {
  const { db } = await import('#/db')
  const data = await db.query.transactions.findMany()
  return { data }
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getTransactions(),
})

export type TransactionChartDataType = 'Income' | 'Expense' | 'Other'

function Home() {
  const { data } = Route.useLoaderData()
  const formattedData = data.map((t) => {
    return {
      id: t.id,
      description: t.description,
      amount: t.amount,
      transactionDate: t.transactionDate,
    }
  })

  const transactionData: {
    type: TransactionChartDataType
    amount: number
  }[] = data.map((t) => {
    if (!t || !t.amount) {
      return {
        type: 'Other',
        amount: 0,
      }
    } else if (t.amount > 0) {
      return {
        type: 'Income',
        amount: t.amount,
      }
    } else {
      return {
        type: 'Expense',
        amount: Math.abs(t.amount),
      }
    }
  })

  return (
    <>
      <nav className="p-4 flex text-xl justify-between items-center bg-primary-foreground">
        <h1 className="font-bold">Budget Tracker</h1>
        <Button asChild>
          <Link
            to="/transactions/new"
            className="text-primary-foreground font-semibold"
          >
            <Plus /> Add Transaction
          </Link>
        </Button>
      </nav>
      <main className="flex flex-col p-4 gap-4 max-w-4xl mx-auto">
        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle>
              <h2>Transactions By Category</h2>
            </CardTitle>
            <CardDescription>
              <p>May 2025</p>
            </CardDescription>
            <CardContent>
              <TransactionChart transactionData={transactionData} />
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle>
              <h2>Recent Transactions</h2>
            </CardTitle>
            <CardDescription>
              <p>all transactions for May 2025</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionDataTable columns={columns} data={formattedData} />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
