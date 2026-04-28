'use server'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function apiFetch(url:string, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    const refresh = (await cookies()).get('refresh')?.value;
    if (refresh) {
      const refresh_req = await refreshToken(refresh);
      if (refresh_req.success) return;
    }
    // Both tokens failed — clear cookies and send to login
    (await cookies()).delete('token');
    (await cookies()).delete('refresh');
    redirect("/authentication");
  }
}

export async function refreshToken(token:string){
  const res = await fetch("http://127.0.0.1:8000/api/token/refresh",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({refresh:token})
  })
  const data = await res.json();
<<<<<<< Updated upstream
  if (res.status === 200) {
    await saveToken(data);
    return {success:true,...data};
  }
  (await cookies()).delete('token');
  (await cookies()).delete('refresh');
=======
  console.log(data);
  if (res.status === 200) return {success:true,...data};
>>>>>>> Stashed changes
  return {success:false};
}

export async function saveToken(tokenObject: { access: string; refresh: string }){
  (await cookies()).set('token', tokenObject.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1
    });
    (await cookies()).set('refresh', tokenObject.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1
    });
}

export async function verifyToken(token:string){
  const res = await fetch("http://127.0.0.1:8000/api/token/verify",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token:token})
  })
  const data = await res;
  if(data.status === 200) return true;
  return false;
}