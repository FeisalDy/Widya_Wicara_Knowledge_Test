'use server'

type AuthBodyT = {
  email: string
  password: string
}

type AuthResponseT = {
  token?: string
  error?: { message: string; error: string }
}

export async function auth (body: AuthBodyT): Promise<AuthResponseT> {
  try {
    const res = await fetch(`http://localhost:3333/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { error: errorData.message || 'Failed to login' }
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    return {
      error: {
        message: 'Network error or server unreachable',
        error: error as string
      }
    }
  }
}

type RegisterBodyT = {
  name: string
  email: string
  password: string
  gender: string
}

type RegisterResponseT = {
  message?: string
  token?: string
  error?: { message: string; error: string }
}

export async function registerUser (
  body: RegisterBodyT
): Promise<RegisterResponseT> {
  try {
    const res = await fetch(`http://localhost:3333/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errorData = await res.json()
      return {
        error: {
          message: 'Failed to register',
          error: errorData.error || 'Failed to register'
        }
      }
    }

    const data = await res.json()

    if (res.status === 400) {
      return {
        error: {
          message: 'Failed to register',
          error: data.error
        }
      }
    }

    const login = await auth({
      email: body.email,
      password: body.password
    }).then(data => data)

    return login.token ? { token: login.token } : { error: login.error }
  } catch (error) {
    console.error('Error:', error)
    return {
      error: {
        message: 'Network error or server unreachable',
        error: error as string
      }
    }
  }
}
