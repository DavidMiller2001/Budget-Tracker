import { formSchema, TransactionForm } from '#/components/newTransactionForm'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import z from 'zod'

export const Route = createFileRoute('/transactions/new/')({
  component: RouteComponent,
})

const addNewTransaction = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      amount: z.number(),
      description: z.string(),
      createdAt: z.date(),
    }),
  )
  .handler(async ({ data }) => {
    const { db } = await import('#/db')
    const { transactions } = await import('#/db/schema')
    await db.insert(transactions).values({
      amount: data.amount,
      description: data.description,
      createdAt: data.createdAt,
    })
    throw redirect({ to: '/' })
  })

function RouteComponent() {
  const addNewTransactionFn = useServerFn(addNewTransaction)

  function handleSubmit(data: z.infer<typeof formSchema>) {
    addNewTransactionFn({ data: { ...data } })
  }

  return (
    <div className="w-full max-w-md">
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  )
}
