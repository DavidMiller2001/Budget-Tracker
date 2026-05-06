import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Trash2, SquarePen, Plus } from 'lucide-react'

const getTransactions = createServerFn({ method: 'GET' }).handler(async () => {
  const { db } = await import('#/db')
  const data = await db.query.transactions.findMany()
  return { data }
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getTransactions(),
})

function Home() {
  const { data } = Route.useLoaderData()

  return (
    <div className="max-w-2xl w-full flex flex-col h-screen justify-center items-center m-auto">
      <Link to="/transactions/new">
        <Button asChild variant={'ghost'} size={'icon-sm'}>
          <Plus />
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{`$ ${t.amount}`}</TableCell>
              <TableCell>{formatDate(t.createdAt || new Date())}</TableCell>
              <TableCell>
                <Button asChild variant={'outline'} size={'icon-xs'}>
                  <SquarePen />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant={'destructiveGhost'} size={'icon-xs'} asChild>
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
  }).format(date)
}
