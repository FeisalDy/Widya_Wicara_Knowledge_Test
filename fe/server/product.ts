'use server'
import { ProductT, DataProductT, DataProductPaginationT } from '@/types/Product'
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
  product: Omit<DataProductT, 'id'>
}
export async function createProduct ({ product }: createProductParamsT) {
  const token = await getJWTToken()

  try {
    const res = await fetch('http://localhost:3333/api/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create product')
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      error: 'Network error or server unreachable'
    }
  }
}

type updateProductParamsT = {
  product: DataProductT
}

export async function updateProduct ({ product }: updateProductParamsT) {
  const token = await getJWTToken()

  try {
    const res = await fetch('http://localhost:3333/api/product/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update product')
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      error: 'Network error or server unreachable'
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
