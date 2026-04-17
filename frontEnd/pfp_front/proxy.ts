import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshToken, verifyToken } from './lib/authorization_handling';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const refresh = request.cookies.get('refresh')?.value
  const isProtectedRoute = true;
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/authentication') 
  //this if has to change after changing protected route
  if (isProtectedRoute && !token && !isAuthRoute) {
    const loginUrl = new URL('/authentication', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  if(token && !verifyToken(token)){
    if(!(await refreshToken(refresh!)).success) return NextResponse.redirect(new URL('/authentication',request.url));
  }

  if (isAuthRoute && token){
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  return NextResponse.next()
}

// Specify which routes middleware should run on
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)',],
}