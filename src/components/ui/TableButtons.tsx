import { Link, useRouter } from '@tanstack/react-router'
import { Button } from './button'
import { SquarePen, Trash2 } from 'lucide-react'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'

const deleteTransaction = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { db } = await import('#/db')
    const { transactions } = await import('#/db/schema')
    await db.delete(transactions).where(eq(transactions.id, data.id))
  })

export function UpdateTransactionButton(props: { id: number }) {
  return (
    <Button size={'icon-sm'} asChild variant={'ghost'}>
      <Link to="/transactions/$id" params={{ id: props.id.toString() }}>
        <SquarePen />
      </Link>
    </Button>
  )
}

export function DeleteTransactionButton(props: { id: number }) {
  const deleteTransactionFn = useServerFn(deleteTransaction)
  const router = useRouter()

  return (
    <Button
      variant="destructiveGhost"
      size="icon-sm"
      onClick={async () => {
        await deleteTransactionFn({ data: { id: props.id } })
        router.invalidate()
      }}
    >
      <Trash2 />
    </Button>
  )
}
