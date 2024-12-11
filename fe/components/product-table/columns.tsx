'use client'

import { ColumnDef } from '@tanstack/react-table'
import DataTableRowActions from '@/components/product-table/DataTableRowActions'

export type ProductT = {
  id: string
  name: string
  price: number
  category: string
  description: string
}

type ProductColumnsT = {
  onEdit: (product: ProductT) => void
  onDelete: (product: ProductT) => void
}

export const ProductTableColumns = ({
  onEdit,
  onDelete
}: ProductColumnsT): ColumnDef<ProductT>[] => [
  {
    accessorKey: 'name',
    header: () => <div className=''>Name</div>,
    cell: ({ row }) => {
      return <div className=''>{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'price',
    header: () => <div className=''>Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className=''>{formatted}</div>
    }
  },
  {
    accessorKey: 'category',
    header: () => <div className=''>Category</div>,
    cell: ({ row }) => {
      return <div className=''>{row.getValue('category')}</div>
    }
  },
  {
    accessorKey: 'description',
    header: () => <div className=''>Description</div>,
    cell: ({ row }) => {
      return <div className=''>{row.getValue('description')}</div>
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableRowActions row={row} onDelete={onDelete} onEdit={onEdit} />
      )
    }
  }
]
