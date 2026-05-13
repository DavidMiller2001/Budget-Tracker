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

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
    meta: {
      className: 'text-start',
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'transactionDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'desc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-center',
                      header.column.columnDef.meta?.className,
                    )}
                  >
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
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'text-center',
                      cell.column.columnDef.meta?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                <UpdateTransactionButton id={row.original.id} />
                <DeleteTransactionButton id={row.original.id} />
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
