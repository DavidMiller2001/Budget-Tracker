import { TransactionForm } from '#/components/newTransactionForm'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/transactions/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-xl w-full mx-auto">
        <Link to="/">
          <p className="flex py-4 gap-1 items-center text-sm text-muted-foreground">
            <ArrowLeft size={16} /> Back to Dashboard
          </p>
        </Link>
        <TransactionForm />
      </div>
    </main>
  )
}
