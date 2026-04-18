'use server'
import { cookies } from 'next/headers';

const API = 'http://127.0.0.1:8000';

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
  return { success: true };
}
