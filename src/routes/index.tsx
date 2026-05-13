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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  DeleteTransactionButton,
  UpdateTransactionButton,
} from '#/components/ui/TableButtons'

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
        <TransactionDataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  )
}

// function TransactionTable(props: {
//   data: {
//     id: number
//     description: string | null
//     amount: number | null
//     createdAt: Date | null
//     updatedAt: Date | null
//   }[]
// }) {
//   const { data } = props

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Amount</TableHead>
//           <TableHead>Description</TableHead>
//           <TableHead>Date</TableHead>
//           <TableHead></TableHead>
//           <TableHead></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data.map((t) => (
//           <TableRow key={t.id}>
//             <TableCell>{`$ ${t.amount}`}</TableCell>
//             <TableCell>{t.description}</TableCell>
//             <TableCell>
//               {formatDate(t.updatedAt || t.createdAt || new Date())}
//             </TableCell>
//             <TableCell>
//               <UpdateTransactionButton id={t.id} />
//             </TableCell>
//             <TableCell>
//               <DeleteTransactionButton id={t.id} />
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }

// function formatDate(date: Date) {
//   return new Intl.DateTimeFormat(undefined, {
//     dateStyle: 'short',
//   }).format(date)
// }
