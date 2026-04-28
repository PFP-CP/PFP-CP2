'use server'
import { cookies } from 'next/headers'

export async function getReservations() {
  const token = (await cookies()).get('token')?.value
  const response = await fetch('http://127.0.0.1:8000/api/Reservations/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('401')
    throw new Error('Failed to fetch reservations')
  }

  return await response.json()
}
