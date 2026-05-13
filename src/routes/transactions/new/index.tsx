import { TransactionForm } from '#/components/newTransactionForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-md">
      <TransactionForm />
    </div>
  )
}
