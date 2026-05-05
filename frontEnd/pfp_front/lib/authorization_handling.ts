"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function apiFetch(url: string, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    const refresh = (await cookies()).get("refresh")?.value;
    if (refresh) {
      const refresh_req = await refreshToken(refresh);
      if (refresh_req.success) return;
    }
    // Both tokens failed — clear cookies and send to login
    (await cookies()).delete("token");
    (await cookies()).delete("refresh");
    redirect("/authentication");
  }
}

<<<<<<< HEAD
const BASE = "http://127.0.0.1:8000";
=======
const BASE = 'http://127.0.0.1:8000';
>>>>>>> 389ae4d (fix)

export async function authedFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  const makeRequest = (accessToken: string | undefined) =>
    fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken ?? ""}`,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

  let response = await makeRequest(token);

  if (response.status === 401) {
    const refresh = cookieStore.get("refresh")?.value;
    if (refresh) {
      const refreshResult = await refreshToken(refresh);
      if (refreshResult.success) {
        response = await makeRequest(refreshResult.access);
      }
    }
    if (response.status === 401) throw new Error("401");
  }

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response;
}

<<<<<<< HEAD
export async function refreshToken(token: string) {
  const res = await fetch("http://127.0.0.1:8000/api/token/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: token }),
  });
=======
export async function refreshToken(token:string){
  const res = await fetch("http://127.0.0.1:8000/api/token/refresh",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({refresh:token})
  })
>>>>>>> 389ae4d (fix)
  const data = await res.json();
  if (res.status === 200) {
    await saveToken(data);
    return { success: true, ...data };
  }
  (await cookies()).delete("token");
  (await cookies()).delete("refresh");
  return { success: false };
}

export async function saveToken(tokenObject: { access: string; refresh: string }) {
  (await cookies()).set("token", tokenObject.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1,
  });
  (await cookies()).set("refresh", tokenObject.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1,
  });
}

<<<<<<< HEAD
export async function verifyToken(token: string) {
  const res = await fetch("http://127.0.0.1:8000/api/token/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token }),
  });
=======
export async function verifyToken(token:string){
  const res = await fetch("http://127.0.0.1:8000/api/token/verify",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token:token})
  })
>>>>>>> 389ae4d (fix)
  const data = await res;
  if (data.status === 200) return true;
  return false;
}
