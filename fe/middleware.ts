import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware (request: NextRequest) {
  const jwtToken = request.cookies.get('jwtToken')

  if (!jwtToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  const headers = new Headers(request.headers)
  headers.set('x-current-path', request.nextUrl.pathname)

  return NextResponse.next({ request: { headers: headers } })
}

export const config = {
  matcher: ['/product', '/', '/dashboard']
}
