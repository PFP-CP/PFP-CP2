import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshToken, saveToken, verifyToken } from './lib/authorization_handling';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
  const token = (await cookies()).get('token')?.value
  const refresh = (await cookies()).get('refresh')?.value
  const isProtectedRoute = true;
<<<<<<< Updated upstream
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/authentication');
  
=======
  console.log(refresh)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/authentication') 
>>>>>>> Stashed changes
  //this if has to change after changing protected route
  if (isProtectedRoute && !token && !isAuthRoute) {
    const loginUrl = new URL('/authentication', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
<<<<<<< Updated upstream
  
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
=======
  let isValid;
   if(token) isValid =await verifyToken(token); 
   if(token && !isValid){
     const refresh_res = await refreshToken(refresh!); 
    if(!refresh_res.success) return NextResponse.redirect(new URL('/authentication',request.url));
    await saveToken({access:refresh_res.access,refresh:refresh_res.refresh})
    return NextResponse.next();
>>>>>>> Stashed changes
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