import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  const isProtectedRoute = true;
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/authentication') 
  
  if (isProtectedRoute && !token && !isAuthRoute) {
    const loginUrl = new URL('/authentication', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  
  return NextResponse.next()
}

// Specify which routes middleware should run on
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)',],
}