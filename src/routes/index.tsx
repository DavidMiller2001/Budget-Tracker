import { TransactionChart } from '#/components/TransactionChart'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { Trash2, SquarePen, Plus } from 'lucide-react'
import z from 'zod'

const getTransactions = createServerFn({ method: 'GET' }).handler(async () => {
  const { db } = await import('#/db')
  const data = await db.query.transactions.findMany()
  return { data }
})

const deleteTransaction = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { db } = await import('#/db')
    const { transactions } = await import('#/db/schema')
    await db.delete(transactions).where(eq(transactions.id, data.id))
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getTransactions(),
})

export type TransactionChartDataType = 'Income' | 'Expense' | 'Other'

function Home() {
  const { data } = Route.useLoaderData()
  const deleteTransactionFn = useServerFn(deleteTransaction)
  const router = useRouter()

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
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Transaction History</h1>
        </CardTitle>
        <CardDescription>
          <p>
            a list and graphical representation of all documented transactions
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionChart transactionData={transactionData} />
        <Link to="/transactions/new">
          <Button asChild variant={'ghost'} size={'icon-sm'}>
            <Plus />
          </Button>
        </Link>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{`$ ${t.amount}`}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  {formatDate(t.updatedAt || t.createdAt || new Date())}
                </TableCell>
                <TableCell>
                  <Button size={'icon-sm'} asChild variant={'ghost'}>
                    <Link
                      to="/transactions/$id"
                      params={{ id: t.id.toString() }}
                    >
                      <SquarePen />
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructiveGhost"
                    size="icon-sm"
                    onClick={async () => {
                      await deleteTransactionFn({ data: { id: t.id } })
                      router.invalidate()
                    }}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
  }).format(date)
}
