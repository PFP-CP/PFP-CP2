"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { PublicSellerProfile } from "@/types/api_types";

<<<<<<< HEAD
const API = "http://127.0.0.1:8000";
=======
const API = 'http://127.0.0.1:8000';
>>>>>>> 389ae4d (fix)

export async function getMyProfile(): Promise<{
  id: number;
  full_name: string;
  email: string;
  profile_picture: string | null;
} | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const response = await fetch(`${API}/api/Account/my-profile/`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    id: data.id,
    full_name: data.full_name ?? "",
    email: data.email ?? "",
    profile_picture: data.profile_picture ?? null,
  };
}

export async function getSellerProfile(
  sellerId: string,
): Promise<PublicSellerProfile | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const response = await fetch(`${API}/api/Mynook/profile/${sellerId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
}

export async function checkEmailVerified(email: string): Promise<{ verified: boolean }> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { verified: false };
  const response = await fetch(`${API}/api/Account/email_confirmation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, key: "" }),
    cache: "no-store",
  });
  console.log(response);
  // 400 means is_active is already true → verified
  return { verified: response.status === 400 };
}

export async function sendVerificationEmail(
  email: string,
): Promise<{ success: boolean; alreadyVerified?: boolean; error?: string }> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Not authenticated" };
  const response = await fetch(`${API}/api/Account/email_confirmation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  console.log(response);
  if (response.status === 400) {
    const data = await response.json().catch(() => ({}));
    if ((data.detail as string)?.includes("already active"))
      return { success: true, alreadyVerified: true };
    return { success: false, error: data.detail ?? "Failed to send email." };
  }
  if (!response.ok) return { success: false, error: "Failed to send email." };
  return { success: true };
}

export async function verifyEmailCode(
  email: string,
  key: string,
): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Not authenticated" };
  const response = await fetch(`${API}/api/Account/email_confirmation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, key }),
    cache: "no-store",
  });
  if (!response.ok) return { success: false, error: "Verification failed." };
  const data = await response.json().catch(() => ({}));
  if ((data.detail as string) === "Success") {
    (await cookies()).set("email_verified", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return { success: true };
  }
  return { success: false, error: data.detail ?? "Invalid code." };
}

export async function isUserVerified(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const email = cookieStore.get("user_email")?.value;
  if (!token || !email) return false;
  try {
    const response = await fetch(
      `${API}/api/Account/isUserVerfied?mail=${encodeURIComponent(email)}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data["Is User Verified"] === true;
  } catch {
    return false;
  }
}

export async function changeProfilePicture(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Not authenticated" };
  const response = await fetch(`${API}/api/Account/changePicture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, error: err?.detail ?? "Failed to update picture." };
  }
  return { success: true };
}

export async function changePassword(
  old_password: string,
  new_password: string,
): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`${API}/api/Account/changePassword/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return {
      success: false,
      error: err?.Error ?? "Password change failed. Please try again.",
    };
  }
  return { success: true };
}

export async function updateProfile(data: {
  full_name?: string;
  date_of_birth?: string;
  state?: string;
  gender?: string;
  phone_number?: string;
  email?: string;
}): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`${API}/api/Account/profile/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, error: err?.message ?? "Update failed. Please try again." };
  }
  return { success: true };
}
