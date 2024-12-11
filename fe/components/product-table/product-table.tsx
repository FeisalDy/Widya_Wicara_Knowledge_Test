'use client'
import { ProductTableColumns } from './columns'
import { DataTable } from './data-table'
import { getProducts } from '@/server/product'
import { useState, useCallback, useMemo } from 'react'
import { ProductT as ProductTableColumnsT } from './columns'
import { DrawerDialogProduct } from './DrawerDialog'
import { Button } from '../ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from '@/server/product'
import { SearchForm } from '@/components/search-form'
import { LoadingSpinner } from '@/components/loading-spinner'

export function ProductTable () {
  const queryClient = useQueryClient()

  const [selectedProduct, setSelectedProduct] =
    useState<ProductTableColumnsT | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'Edit' | 'Create'>('Edit')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data, isPending, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ page: 1, limit: 100000 })
  })

  const onAdd = useCallback(() => {
    setIsDialogOpen(true)
    setMode('Create')
  }, [])

  const onDelete = useCallback(
    (product: ProductTableColumnsT) => server_deleteProduct(product.id),
    []
  )
  const onEdit = useCallback((product: ProductTableColumnsT) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
    setMode('Edit')
  }, [])

  const columnsMemo = useMemo(
    () => ProductTableColumns({ onEdit, onDelete }),
    []
  )

  const { mutate: server_deleteProduct } = useMutation({
    mutationFn: (id: string) => deleteProduct({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: error => {
      console.error('Error deleting product:', error)
    }
  })

  const filteredProducts = useMemo(() => {
    if (!data?.data?.data) return []
    return data.data.data.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <LoadingSpinner size={64} className='animate-spin text-primary' />
      </div>
    )
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between mb-4'>
        <SearchForm
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => onAdd()}>Add Product</Button>
      </div>
      <DataTable columns={columnsMemo} data={filteredProducts ?? []} />
      <DrawerDialogProduct
        mode={mode}
        isOpen={isDialogOpen}
        onOpenChange={value => {
          setIsDialogOpen(value)
          if (!value) setSelectedProduct(null)
        }}
        product={selectedProduct}
      />
    </div>
  )
}
