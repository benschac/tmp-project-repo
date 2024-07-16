import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  console.log(token, 'from middleware')

  if (request.nextUrl.pathname === '/api/exchange-token') {
    console.log('request.nextUrl.pathname', request.nextUrl.pathname)
    return NextResponse.next()
  }

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  // Clone the request headers and set the Authorization header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Authorization', `Bearer ${token}`)

  // You can also add the token to the request object for use in your API route
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/api/:path*',
}
