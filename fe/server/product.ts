'use server'
import { ProductT, DataProductT } from '@/types/Product'
import { getJWTToken } from '@/lib/getJWTToken'

type getProductParamsT = {
  page?: number
  limit?: number
}

export async function getProducts (
  params: getProductParamsT
): Promise<{ data: ProductT }> {
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 10
  const token = await getJWTToken()

  try {
    const res = await fetch(
      `http://localhost:3333/api/product?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await res.json()

    if (!res.ok) {
      return {
        data: {
          error: data.message || 'Failed to fetch products'
        }
      }
    }

    return { data }
  } catch (error) {
    console.log('Error:', error)
    return {
      data: {
        error: 'Network error or server unreachable'
      }
    }
  }
}

type createProductParamsT = {
  product: DataProductT
}

type createProductResponseT = {
  message?: string
  error?: { message: string; error: string }
}

export async function createProduct ({
  product
}: createProductParamsT): Promise<createProductResponseT> {
  const token = await getJWTToken()

  console.log('createProduct is called:', product)
  try {
    const { id, ...rest } = product
    const res = await fetch('http://localhost:3333/api/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(rest)
    })

    if (!res.ok) {
      const errorData = await res.json()
      return {
        error: {
          message: errorData.message || 'Failed to create product',
          error: errorData.error || 'Failed to create product'
        }
      }
    }

    const data = await res.json()

    if (res.status === 400) {
      return {
        error: {
          message: 'Failed to create product',
          error: data.error
        }
      }
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      error: {
        message: 'Network error or server unreachable',
        error: error as string
      }
    }
  }
}

type updateProductParamsT = {
  product: DataProductT
}

type updateProductResponseT = {
  message?: string
  error?: { message: string; error: string }
}

export async function updateProduct ({
  product
}: updateProductParamsT): Promise<updateProductResponseT> {
  const token = await getJWTToken()

  try {
    console.log('updateProduct is called:', product)

    const res = await fetch('http://localhost:3333/api/product/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })

    if (!res.ok) {
      const errorData = await res.json()
      return {
        error: {
          message: errorData.message || 'Failed to update product',
          error: errorData.error || 'Failed to update product'
        }
      }
    }
    const data = await res.json()

    if (res.status === 400) {
      return {
        error: {
          message: 'Failed to update product',
          error: data.error
        }
      }
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      error: {
        message: 'Network error or server unreachable',
        error: error as string
      }
    }
  }
}

export async function deleteProduct ({ id }: { id: string }) {
  const token = await getJWTToken()
  console.log('id:', id)

  try {
    const res = await fetch('http://localhost:3333/api/product/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete product')
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      error: 'Network error or server unreachable'
    }
  }
}
