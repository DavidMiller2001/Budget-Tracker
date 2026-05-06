import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'
import z from 'zod'

export const Route = createFileRoute('/transactions/new/')({
  component: RouteComponent,
})

const addNewTransaction = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ amount: z.number() }))
  .handler(async ({ data }) => {
    const { db } = await import('#/db')
    const { transactions } = await import('#/db/schema')
    await db.insert(transactions).values({ amount: data.amount })
    throw redirect({ to: '/' })
  })

function RouteComponent() {
  const amountRef = useRef<HTMLInputElement>(null)
  const addNewTransactionFn = useServerFn(addNewTransaction)

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const amount = amountRef.current?.value
    if (!amount) return

    const amountFormatted = parseInt(amount)
    addNewTransactionFn({ data: { amount: amountFormatted } })
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
      <Input
        autoFocus
        ref={amountRef}
        placeholder="Enter the amount"
        className="flex-1"
        aria-label="amount"
        defaultValue={0}
      />

      <Button type="submit" asChild>
        <span>
          <PlusIcon /> Add
        </span>
      </Button>
    </form>
  )
}
