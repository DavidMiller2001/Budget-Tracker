import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const transactions = sqliteTable('transactions', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  description: text('description'),
  amount: integer('amount', { mode: 'number' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
})
