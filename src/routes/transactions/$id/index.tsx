import { UpdateTransactionForm } from '#/components/updateTransactionForm'
import { transactions } from '#/db/schema'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
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
    <div className="w-full max-w-md">
      <UpdateTransactionForm
        transaction={{
          id: result[0].id,
          amount: result[0].amount || 0,
          description: result[0].description || '',
          createdAt: result[0].createdAt || new Date(),
        }}
      />
    </div>
  )
}
