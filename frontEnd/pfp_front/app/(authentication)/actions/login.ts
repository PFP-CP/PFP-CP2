'use server'

import { cookies } from "next/headers";



export async function login(Identifier:string, password:string){
  const response = await fetch("http://127.0.0.1:8000/api/Account/Login",{
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
    })
    return {success: true};
  }

  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  (await cookies()).delete('token')
}