'use server'
import { authedFetch } from '@/lib/authorization_handling'

export async function getReservations() {
  const response = await authedFetch('/api/Reservations/', { method: 'GET', cache: 'no-store' })
  return await response.json()
}
