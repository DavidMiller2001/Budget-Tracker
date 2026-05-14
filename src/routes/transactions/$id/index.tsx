import { UpdateTransactionForm } from '#/components/updateTransactionForm'
import { transactions } from '#/db/schema'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import z from 'zod'

export const Route = createFileRoute('/transactions/$id/')({
  component: RouteComponent,
  loader: ({ params }) => getTransaction({ data: { id: params.id } }),
})

const getTransaction = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const numId = parseInt(data.id)
    const { db } = await import('#/db')
    const result = await db.query.transactions.findMany({
      where: eq(transactions.id, numId),
    })
    return { result }
  })

function RouteComponent() {
  const { result } = Route.useLoaderData()
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-xl w-full mx-auto">
        <Link to="/">
          <p className="flex py-4 gap-1 items-center text-sm text-muted-foreground">
            <ArrowLeft size={16} /> Back to Dashboard
          </p>
        </Link>
        <UpdateTransactionForm
          transaction={{
            id: result[0].id,
            amount: result[0].amount || 0,
            description: result[0].description || '',
            transactionDate: result[0].transactionDate,
          }}
        />
      </div>
    </main>
  )
}
