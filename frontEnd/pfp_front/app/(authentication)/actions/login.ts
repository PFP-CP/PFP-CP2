'use server'

import { cookies } from "next/headers";



export async function login(Identifier:string, password:string){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/Account/Login`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({password,Identifier}),
  });
  const data = await response.json();
  if(!data.Error){
    (await cookies()).set('token', data.tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    (await cookies()).set('refresh', data.tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    // Also set in localStorage for client-side API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.tokens.access);
      localStorage.setItem('refresh', data.tokens.refresh);
    }

    return {success: true};
  }

  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  (await cookies()).delete('token');
  (await cookies()).delete('refresh');

  // Also clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
}




