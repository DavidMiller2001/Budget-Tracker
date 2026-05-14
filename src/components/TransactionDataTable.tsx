import type { Transaction } from '#/db/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import {
  DeleteTransactionButton,
  UpdateTransactionButton,
} from './ui/TableButtons'
import { cn } from '#/lib/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from './ui/badge'

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'transactionDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.transactionDate

      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
      }).format(date)
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.original.amount

      return (
        <div className={cn(amount < 0 ? 'text-destructive' : '')}>
          ${amount}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: () => <div className="text-start">Description</div>,
    cell: ({ row }) => {
      const description = row.original.description
      return <div className="text-start">{description}</div>
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category
      switch (category) {
        case 'Income':
          return (
            <Badge style={{ backgroundColor: 'var(--primary)' }}>
              {category}
            </Badge>
          )
        case 'Bill':
          return (
            <Badge style={{ backgroundColor: 'var(--destructive)' }}>
              {category}
            </Badge>
          )
        case 'Food':
          return (
            <Badge
              style={{ backgroundColor: 'var(--food-color)' }}
              className="bg-[--food-color]"
            >
              {category}
            </Badge>
          )
        case 'Entertainment':
          return (
            <Badge style={{ backgroundColor: 'var(--entertainment-color)' }}>
              {category}
            </Badge>
          )
        case 'Other':
          return (
            <Badge style={{ backgroundColor: 'var(--other-color)' }}>
              {category}
            </Badge>
          )
      }
    },
  },
  {
    header: () => <div className="text-center">Actions</div>,
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-center gap-1">
          <UpdateTransactionButton id={row.original.id} />
          <DeleteTransactionButton id={row.original.id} />
        </div>
      )
    },
  },
]

interface DataTableProps {
  columns: ColumnDef<Transaction>[]
  data: Transaction[]
}

export function TransactionDataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'transactionDate',
      desc: true,
    },
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
