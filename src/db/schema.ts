import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { type InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const transactions = sqliteTable('transactions', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  description: text('description'),
  amount: integer('amount', { mode: 'number' }).notNull(),
  transactionDate: integer('transactionDate', { mode: 'timestamp' }).notNull(),
})

export type Transaction = InferSelectModel<typeof transactions>
export const insertTransactionSchema = createInsertSchema(transactions)

export const selectTransactionSchema = createSelectSchema(transactions)
