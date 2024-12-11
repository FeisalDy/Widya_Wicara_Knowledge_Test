import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/server/product'
import { DataProductT } from '@/types/Product'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type ProductFormPropsT = {
  className?: string
  mode: 'Edit' | 'Create'
  product?: DataProductT | null
  onOpenChange: (value: boolean) => void
}

export function ProductForm ({
  className,
  mode,
  product,
  onOpenChange
}: ProductFormPropsT) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = React.useState<DataProductT>({
    id: product?.id || '',
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    description: product?.description || ''
  })

  const {
    mutate: server_createProduct,
    isPending,
    isError
  } = useMutation({
    mutationFn: (productData: Omit<DataProductT, 'id'>) =>
      createProduct({ product: productData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
    },
    onError: error => {
      console.error('Error creating product:', error)
    }
  })

  const {
    mutate: server_updateProduct,
    isPending: isUpdatePending,
    isError: isUpdateError
  } = useMutation({
    mutationFn: (productData: DataProductT) =>
      updateProduct({ product: productData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
    },
    onError: error => {
      console.error('Error updating product:', error)
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData: DataProductT = {
      id: formData.id,
      name: formData.name,
      price: parseFloat(formData.price.toString()),
      category: formData.category,
      description: formData.description
    }

    if (mode === 'Edit') {
      server_updateProduct(productData)
    }

    if (mode === 'Create') {
      server_createProduct(productData)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('grid items-start gap-4', className)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='name'>Product Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='price'>Price</Label>
        <Input
          type='number'
          id='price'
          name='price'
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='category'>Category</Label>
        <Input
          id='category'
          name='category'
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          name='description'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <Button type='submit' disabled={isPending}>
        {mode === 'Edit' ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  )
}
