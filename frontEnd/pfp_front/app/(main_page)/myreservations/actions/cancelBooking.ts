'use server'
import { authedFetch } from '@/lib/authorization_handling'

export async function cancelBooking(reservationId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await authedFetch(`/api/Reservations/${reservationId}`, { method: 'DELETE' })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return { success: false, error: err?.detail ?? 'Failed to cancel booking' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to cancel booking' }
  }
}
