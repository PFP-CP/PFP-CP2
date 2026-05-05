import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API = 'http://127.0.0.1:8000'

// Decode JWT expiry locally — no network call needed
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

async function tryRefresh(
  refresh: string,
): Promise<{ success: false } | { success: true; access: string }> {
  try {
    const res = await fetch(`${API}/api/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (res.status === 200) {
      const data = await res.json();
      return { success: true, access: data.access };
    }
  } catch {}
  return { success: false };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/authentication");
  const isVerifyRoute = pathname.startsWith("/verify");

  let token = request.cookies.get("token")?.value;
  const refresh = request.cookies.get("refresh")?.value;

  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/authentication", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let needsNewCookie = false;
  let newTokenValue = "";

  if (token && isTokenExpired(token)) {
    if (!refresh) return NextResponse.redirect(new URL("/authentication", request.url));
    const refreshed = await tryRefresh(refresh);
    if (!refreshed.success)
      return NextResponse.redirect(new URL("/authentication", request.url));
    needsNewCookie = true;
    newTokenValue = refreshed.access;
    token = newTokenValue;
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Check email verification — cached in a cookie so we only hit the backend once
  if (token && !isAuthRoute && !isVerifyRoute) {
    const verified = request.cookies.get("email_verified")?.value === "1";
    if (!verified) {
      try {
        const email = request.cookies.get("user_email")?.value;
        if (email) {
          const verRes = await fetch(
            `${API}/api/Account/isUserVerfied?mail=${encodeURIComponent(email)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (verRes.ok) {
            const data = await verRes.json();
            if (data["Is User Verified"] === false) {
              const res = NextResponse.redirect(new URL("/authentication", request.url));
              res.cookies.delete("token");
              res.cookies.delete("refresh");
              res.cookies.delete("user_email");
              res.cookies.delete("email_verified");
              return res;
            }
          }
        }
      } catch {}
    }
  }

  const response = NextResponse.next();

  if (needsNewCookie) {
    response.cookies.set("token", newTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  // Cache verified state so subsequent requests skip the backend call
  if (
    token &&
    !isAuthRoute &&
    !isVerifyRoute &&
    request.cookies.get("email_verified")?.value !== "1"
  ) {
    response.cookies.set("email_verified", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
