'use server'
import { cookies } from 'next/headers'

export async function cancelBooking(reservationId: number): Promise<{ success: boolean; error?: string }> {
  const token = (await cookies()).get('token')?.value
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/${reservationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    return { success: false, error: err?.detail ?? 'Failed to cancel booking' }
  }

  return { success: true }
}
