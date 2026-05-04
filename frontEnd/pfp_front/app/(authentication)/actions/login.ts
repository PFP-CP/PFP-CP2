'use server'

import { cookies } from "next/headers";



export async function login(Identifier:string, password:string){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://10.93.250.163:8000'}/api/Account/Login`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({password,Identifier}),
  });
  const data = await response.json();
  if(!data.Error){
    const cookieStore = await cookies();
    const opts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    };
    cookieStore.set('token', data.tokens.access, opts);
    cookieStore.set('refresh', data.tokens.refresh, opts);
    cookieStore.set('user_email', Identifier, opts);

    try {
      const verRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://10.93.250.163:8000'}/api/Account/isUserVerfied?mail=${encodeURIComponent(Identifier)}`,
        { method: 'GET', headers: { Authorization: `Bearer ${data.tokens.access}` } }
      );
      if (verRes.ok) {
        const verData = await verRes.json();
        if (verData['Is User Verified'] === false) {
          return { success: true, needsVerification: true };
        }
      }
    } catch {}

    return { success: true, needsVerification: false };
  }

  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('refresh');
  cookieStore.delete('user_email');
  cookieStore.delete('email_verified');
}




