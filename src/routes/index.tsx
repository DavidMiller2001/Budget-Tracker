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
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Progress } from '#/components/ui/progress'
import type { categories } from '#/db/schema'
import { cn } from '#/lib/utils'

import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
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

  let totalIncome = 0
  let totalExpense = 0

  const expenseData: {
    billAmount: number
    foodAmount: number
    entertainmentAmount: number
    otherAmount: number
  } = {
    billAmount: 0,
    foodAmount: 0,
    entertainmentAmount: 0,
    otherAmount: 0,
  }

  const expenseCategories = Object.keys(
    expenseData,
  ) as (keyof typeof expenseData)[]

  const transactionData: {
    category: (typeof categories)[number]
    amount: number
  }[] = data.map((t) => {
    if (!t || !t.amount) {
      return {
        category: 'Other',
        amount: 0,
      }
    }

    if (t.category === 'Income') {
      totalIncome += t.amount
    } else {
      totalExpense += t.amount
    }

    switch (t.category) {
      case 'Bill':
        expenseData.billAmount += t.amount
        break
      case 'Food':
        expenseData.foodAmount += t.amount
        break
      case 'Entertainment':
        expenseData.entertainmentAmount += t.amount
        break
      case 'Other':
        expenseData.otherAmount += t.amount
        break
    }

    return {
      category: t.category,
      amount: Math.abs(t.amount),
    }
  })

  return (
    <>
      <nav className="p-4 flex text-xl justify-between items-center bg-primary-foreground">
        <h1 className="font-bold">Budget Tracker</h1>
        <Button asChild>
          <Link
            to="/transactions/new"
            className="text-primary-foreground font-semibold"
          >
            <Plus /> Add Transaction
          </Link>
        </Button>
      </nav>

      <main className="flex flex-col p-4 gap-4 max-w-4xl mx-auto pb-0">
        <div className="grid grid-cols-[1fr_2fr] grid-rows-3 gap-4">
          <Card className="bg-primary-foreground flex justify-center">
            <CardContent>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center justify-center bg-accent w-[50px] h-[50px] rounded-xl">
                  <TrendingUp color="var(--color-primary)" />
                </div>
                <div className="text-end">
                  <p className="text-muted-foreground text-xs">
                    Income this month
                  </p>
                  <h3 className="text-primary font-bold text-xl">{`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground col-1 flex justify-center">
            <CardContent>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center justify-center bg-destructive/30 w-[50px] h-[50px] rounded-xl">
                  <TrendingDown color="var(--color-destructive)" />
                </div>
                <div className="text-end">
                  <p className="text-muted-foreground text-xs">
                    Expenses this month
                  </p>
                  <h3 className="text-destructive font-bold text-xl">{`$${Math.abs(totalExpense).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-foreground col-1 flex justify-center">
            <CardContent>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center justify-center bg-foreground/50 w-[50px] h-[50px] rounded-xl">
                  <Wallet />
                </div>
                <div className="text-end">
                  <p className="text-muted-foreground text-xs">Net Balance</p>
                  <h3
                    className={cn(
                      'font-bold text-xl',
                      totalIncome - Math.abs(totalExpense) >= 0
                        ? 'text-primary'
                        : 'text-destructive',
                    )}
                  >
                    {`$${(totalIncome - Math.abs(totalExpense)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-foreground row-start-1 row-span-3 col-2">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <h2>Expenses by Category</h2>
                <h3>{`$${Math.abs(totalExpense).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {expenseCategories.map((category, i) => (
                  <CategoryProgressBar
                    key={i}
                    category={category.replace('Amount', '') as string}
                    amount={expenseData[category]}
                    totalExpense={totalExpense}
                  />
                ))}
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle>
              <h2>Transactions By Category</h2>
            </CardTitle>
            <CardDescription>
              <p>May 2025</p>
            </CardDescription>
            <CardContent>
              <TransactionChart transactionData={transactionData} />
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle>
              <h2>Recent Transactions</h2>
            </CardTitle>
            <CardDescription>
              <p>all transactions for May 2025</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionDataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      </main>
      <footer>
        <p className="text-center text-muted-foreground text-sm p-4">
          © 2023 Budget Tracker. All rights reserved.
        </p>
      </footer>
    </>
  )
}

function CategoryProgressBar(props: {
  category: string
  amount: number
  totalExpense: number
}) {
  const { category, amount, totalExpense } = props
  const percentage =
    totalExpense !== 0 ? Math.abs((amount / totalExpense) * 100) : 0

  return (
    <Field>
      <FieldLabel htmlFor={`${category.toLowerCase()}-bar`}>
        <div className="flex justify-between items-end  w-full">
          <span className="capitalize">{category}</span>
          <span className="">{`$${Math.abs(amount)}`}</span>
        </div>
      </FieldLabel>
      <Progress
        id={`${category.toLowerCase()}-bar`}
        value={percentage}
        indicatorColor={`var(--${category.toLowerCase()}-color)`}
      />
    </Field>
  )
}
