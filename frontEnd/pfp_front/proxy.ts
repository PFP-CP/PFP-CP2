import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshToken, verifyToken } from './lib/authorization_handling';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const refresh = request.cookies.get('refresh')?.value
  const isProtectedRoute = true;
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/authentication');
  
  //this if has to change after changing protected route
  if (isProtectedRoute && !token && !isAuthRoute) {
    const loginUrl = new URL('/authentication', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  if(token && !(await verifyToken(token))){
    const refresh_res = await refreshToken(refresh!);
    if(!refresh_res.success) return NextResponse.redirect(new URL('/authentication',request.url));
    // saveToken uses next/headers which doesn't work in middleware — set cookie on the response directly
    const response = NextResponse.next();
    response.cookies.set('token', refresh_res.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
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