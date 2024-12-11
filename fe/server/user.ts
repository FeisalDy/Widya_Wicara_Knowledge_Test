'use server'
import { getJWTToken } from '@/lib/getJWTToken'
import { DataUserT, UserT } from '@/types/User'

export async function getProfile (): Promise<UserT> {
  const token = await getJWTToken()

  try {
    const res = await fetch(`${process.env.API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()

    if (!res.ok) {
      return {
        message: 'Failed to fetch profile',
        error: data.error || 'Failed to fetch profile'
      }
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      message: 'Network error or server unreachable',
      error: error as string
    }
  }
}

type UpdateProfilePropsT = {
  profile: Omit<DataUserT, 'id'>
}
type UpdateProfileResponseT = {
  message?: string
  error?: { message: string; error: string }
}
export async function updateUserProfile ({
  profile
}: UpdateProfilePropsT): Promise<UpdateProfileResponseT> {
  const token = await getJWTToken()

  try {
    const res = await fetch(`${process.env.API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    })

    if (!res.ok) {
      const errorData = await res.json()
      return {
        error: {
          message: errorData.message || 'Failed to update profile',
          error: errorData.error || 'Failed to update profile'
        }
      }
    }

    const data = await res.json()

    if (res.status === 400) {
      return {
        error: {
          message: 'Failed to update profile',
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
