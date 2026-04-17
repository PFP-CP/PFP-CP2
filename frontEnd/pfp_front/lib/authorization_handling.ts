'use server'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function apiFetch(url:string, options = {}) {
  const res = await fetch(url, options);
  let token = (await cookies()).get('token')?.value;
  if (res.status === 401) {
    if(token){
      let refresh_req = await refreshToken(token);
      if(refresh_req.success) return 
    }else{
      redirect("/authentication");
    }
  }

}

export async function refreshToken(token:string){
  const res = await fetch("http://127.0.0.1:8000/api/token/refresh",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({refresh:token})
  })
  const data = await res.json();
  saveToken(data);
  if (res.status === 200) return {success:true,...data};
  return {success:false};
}

export async function saveToken(tokenObject: { access: string; refresh: string }){
  (await cookies()).set('token', tokenObject.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    (await cookies()).set('refresh', tokenObject.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
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