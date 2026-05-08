import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DatePickerInput } from './ui/DatePicker'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { transactions } from '#/db/schema'
import { redirect, useRouter } from '@tanstack/react-router'

export const formSchema = z.object({
  description: z.string(),
  amount: z.number(),
  createdAt: z.date(),
})

const updateTransaction = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      amount: z.number(),
      description: z.string(),
      createdAt: z.date(),
    }),
  )
  .handler(async ({ data }) => {
    const numId = parseInt(data.id)
    const { db } = await import('#/db')
    await db
      .update(transactions)
      .set({
        amount: data.amount,
        description: data.description,
        updatedAt: data.createdAt,
      })
      .where(eq(transactions.id, numId))

    throw redirect({ to: '/' })
  })

export function UpdateTransactionForm(props: {
  transaction: {
    id: number
    description: string
    amount: number
    createdAt: Date
  }
}) {
  const { transaction } = props
  const updateTransactionFn = useServerFn(updateTransaction)

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
      createdAt: transaction.createdAt,
    },
  })

  async function onSubmit(formData: z.input<typeof formSchema>) {
    await updateTransactionFn({
      data: {
        id: transaction.id.toString(),
        amount: formData.amount,
        createdAt: formData.createdAt,
        description: formData.description,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Transaction</CardTitle>
        <CardDescription>Update a transaction on your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} id="transaction-form">
          <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id="transaction-description"
                    placeholder="..."
                    autoComplete="on"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="amount"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-amount">
                    Amount ($1.00 = 100)
                  </FieldLabel>

                  <Input
                    type="number"
                    step="any"
                    {...form.register('amount', { valueAsNumber: true })}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="createdAt"
              control={form.control}
              render={() => <DatePickerInput />}
            ></Controller>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="transaction-form" className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
