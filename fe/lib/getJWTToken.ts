import { cookies } from 'next/headers'

export async function getJWTToken () {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('jwtToken')
  const token = tokenCookie ? tokenCookie.value : ''
  return token
}
