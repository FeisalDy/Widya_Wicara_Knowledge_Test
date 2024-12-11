'use server'
import { getJWTToken } from '@/lib/getJWTToken'
import { DataUserT, UserT } from '@/types/User'

export async function getProfile (): Promise<{ data: UserT }> {
  const token = await getJWTToken()

  try {
    const res = await fetch(`http://localhost:3333/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()

    if (!res.ok) {
      return {
        data: {
          error: 'Failed to fetch user profile'
        }
      }
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      data: {
        error: 'Network error or server unreachable'
      }
    }
  }
}

type UpdateProfilePropsT = {
  profile: Omit<DataUserT, 'id'>
}
export async function updateUserProfile ({ profile }: UpdateProfilePropsT) {
  const token = await getJWTToken()

  try {
    const res = await fetch('http://localhost:3333/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile')
    }

    return data
  } catch (error) {
    console.log('Error:', error)
    return {
      data: {
        error: 'Network error or server unreachable'
      }
    }
  }
}
