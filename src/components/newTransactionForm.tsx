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

import { insertTransactionSchema } from '@/db/schema'
import { createServerFn, useServerFn } from '@tanstack/react-start'
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

const categories = ['Income', 'Bill', 'Food', 'Entertainment', 'Other'] as const

const addNewTransaction = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      amount: z.number(),
      description: z.string(),
      transactionDate: z.date(),
      category: z.enum(categories),
    }),
  )
  .handler(async ({ data }) => {
    const { db } = await import('#/db')
    const { transactions } = await import('#/db/schema')
    await db.insert(transactions).values({
      amount: data.amount,
      description: data.description,
      transactionDate: data.transactionDate,
      category: data.category,
    })
    throw redirect({ to: '/' })
  })

export function TransactionForm() {
  const addNewTransactionFn = useServerFn(addNewTransaction)

  const form = useForm<z.input<typeof insertTransactionSchema>>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
      transactionDate: new Date(),
    },
  })

  function onSubmit(data: z.input<typeof insertTransactionSchema>) {
    addNewTransactionFn({
      data: {
        amount: data.amount,
        description: data.description || '',
        transactionDate: data.transactionDate,
        category: data.category,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
        <CardDescription>Add a new transaction to your profile</CardDescription>
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
                    id="transaction-amount"
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
