import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'
import { type InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const categories = [
  'Income',
  'Bill',
  'Food',
  'Entertainment',
  'Other',
] as const

export const transactions = sqliteTable('transactions', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  description: text('description'),
  amount: real('amount').notNull(),
  category: text('category', {
    enum: categories,
  }).notNull(),
  transactionDate: integer('transactionDate', { mode: 'timestamp' }).notNull(),
})

export type Transaction = InferSelectModel<typeof transactions>
export const insertTransactionSchema = createInsertSchema(transactions)

export const selectTransactionSchema = createSelectSchema(transactions)
