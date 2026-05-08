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

export const formSchema = z.object({
  description: z.string(),
  amount: z.number(),
  createdAt: z.date(),
})

export function TransactionForm(props: {
  onSubmit: (data: {
    description: string
    amount: number
    createdAt: Date
  }) => void
  transaction?: {
    description: string
    amount: number
    createdAt: Date
  }
}) {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: '',
      createdAt: new Date(),
    },
  })

  function onSubmit(data: z.input<typeof formSchema>) {
    props.onSubmit(data)
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
