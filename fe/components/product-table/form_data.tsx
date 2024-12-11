import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/server/product'
import { DataProductT } from '@/types/Product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type ProductFormPropsT = {
  className?: string
  mode: 'Edit' | 'Create'
  product?: DataProductT | null
  onOpenChange: (value: boolean) => void
}

const formSchema = z.object({
  id: z.string().min(0),
  name: z.string().min(1, 'Name is required'),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number'
    })
    .min(0, { message: 'Price must be greater than or equal to 0' }),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required')
})

export function ProductForm ({
  className,
  mode,
  product,
  onOpenChange
}: ProductFormPropsT) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: product?.id || '',
      name: product?.name || '',
      price: product?.price || 0,
      category: product?.category || '',
      description: product?.description || ''
    }
  })

  const { handleSubmit, register, watch, formState } = form
  const { errors } = formState

  const {
    data: updateData,
    mutate: server_updateProduct,
    isPending: isUpdatePending,
    isError: isUpdateError
  } = useMutation({
    mutationFn: (formData: z.infer<typeof formSchema>) =>
      updateProduct({ product: formData }),
    onSuccess: data => {
      if (data.error) {
        setErrorMessage(data.error.error || 'An unexpected error occurred.')
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        onOpenChange(false)
      }
    },
    onError: error => {
      setErrorMessage(error.message)
    }
  })

  const {
    data: createData,
    mutate: server_createProduct,
    isPending: isCreatePending,
    isError: isCreateError
  } = useMutation({
    mutationFn: (formData: z.infer<typeof formSchema>) =>
      createProduct({ product: formData }),
    onSuccess: data => {
      if (data.error) {
        console.log('server_createProduct')

        setErrorMessage(data.error.error || 'An unexpected error occurred.')
      } else {
        console.log('server_createProduct')
        queryClient.invalidateQueries({ queryKey: ['products'] })
        onOpenChange(false)
      }
    },
    onError: error => {
      console.log('server_createProduct')

      setErrorMessage(error.message)
    }
  })

  async function onSubmit (values: z.infer<typeof formSchema>) {
    setErrorMessage(null)
    if (mode === 'Create') {
      server_createProduct(values)
    }
    if (mode === 'Edit') {
      server_updateProduct(values)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('grid items-start gap-4', className)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='name'>Product Name</Label>
        <Input
          id='name'
          placeholder='Product name'
          {...register('name')}
          value={watch('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <span className='text-sm text-red-500'>{errors.name.message}</span>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='price'>Price</Label>
        <Input
          id='price'
          placeholder='Product price'
          {...register('price')}
          value={watch('price')}
          className={errors.price ? 'border-red-500' : ''}
        />
        {errors.price && (
          <span className='text-sm text-red-500'>{errors.price.message}</span>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='category'>Category</Label>
        <Input
          id='category'
          placeholder='Product category'
          {...register('category')}
          value={watch('category')}
          className={errors.category ? 'border-red-500' : ''}
        />
        {errors.category && (
          <span className='text-sm text-red-500'>
            {errors.category.message}
          </span>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          placeholder='Product description'
          {...register('description')}
          value={watch('description')}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <span className='text-sm text-red-500'>
            {errors.description.message}
          </span>
        )}
      </div>
      {errorMessage && (
        <div className='text-sm text-red-500 text-center'>{errorMessage}</div>
      )}
      <Button type='submit' disabled={isUpdatePending}>
        {mode === 'Edit' ? 'Save Changes' : 'Create Product'}
        {/* Save Changes */}
      </Button>
    </form>
  )
}
