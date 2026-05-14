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
import { categories, insertTransactionSchema, transactions } from '#/db/schema'
import { redirect } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const updateTransaction = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      amount: z.number(),
      description: z.string(),
      transactionDate: z.date(),
      category: z.enum(categories),
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
        transactionDate: data.transactionDate,
        category: data.category,
      })
      .where(eq(transactions.id, numId))

    throw redirect({ to: '/' })
  })

export function UpdateTransactionForm(props: {
  transaction: {
    id: number
    description: string
    amount: number
    transactionDate: Date
    category: (typeof categories)[number]
  }
}) {
  const { transaction } = props

  console.log('Current category:', transaction.category)

  const updateTransactionFn = useServerFn(updateTransaction)

  const form = useForm<z.input<typeof insertTransactionSchema>>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      category: transaction.category || 'Other',
    },
  })

  async function onSubmit(formData: z.input<typeof insertTransactionSchema>) {
    await updateTransactionFn({
      data: {
        id: transaction.id.toString(),
        amount: formData.amount,
        description: formData.description || '',
        transactionDate: formData.transactionDate,
        category: formData.category,
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
                    value={field.value || ''}
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
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-category">
                    Category
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="transactionDate"
              control={form.control}
              render={({ field }) => (
                <DatePickerInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
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
