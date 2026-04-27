'use server'
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { PublicSellerProfile } from '@/types/api_types';

const API = 'http://127.0.0.1:8000';

export async function getMyProfile(): Promise<{ id: number; full_name: string; email: string; profile_picture: string | null } | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const response = await fetch(`${API}/api/Account/my-profile/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    id: data.id,
    full_name: data.full_name ?? '',
    email: data.email ?? '',
    profile_picture: data.profile_picture ?? null,
  };
}

export async function getSellerProfile(sellerId: string): Promise<PublicSellerProfile | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const response = await fetch(`${API}/api/Mynook/profile/${sellerId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300, tags: [`profile-${sellerId}`] },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function changePassword(old_password: string, new_password: string): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`${API}/api/Account/changePassword/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, error: err?.Error ?? 'Password change failed. Please try again.' };
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
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`${API}/api/Account/profile/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, error: err?.message ?? 'Update failed. Please try again.' };
  }
  revalidateTag('current-user');
  return { success: true };
}
