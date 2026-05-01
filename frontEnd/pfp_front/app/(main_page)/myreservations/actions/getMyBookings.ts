'use server'
import { cookies } from 'next/headers'
import { BookedReservation } from '@/types/api_types'

const BASE_URL = 'http://127.0.0.1:8000'

export async function getMyBookings(): Promise<BookedReservation[]> {
  const token = (await cookies()).get('token')?.value
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Step 1: saved posts — making a reservation auto-saves the post
  const savedRes = await fetch(`${BASE_URL}/api/Posts/saved`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  })

  if (!savedRes.ok) {
    if (savedRes.status === 401) throw new Error('401')
    return []
  }

  const savedPosts: { post_id: string }[] = await savedRes.json()
  if (savedPosts.length === 0) return []

  // Step 2: check each saved post for reservations by the current user
  const checks = await Promise.all(
    savedPosts.map(async ({ post_id }) => {
      const res = await fetch(`${BASE_URL}/api/Reservations/post/${post_id}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      })
      if (!res.ok) return { postId: post_id, reservations: [] as { id: number; arrival_date: string; departure_date: string }[] }
      const data = await res.json()
      return { postId: post_id, reservations: Array.isArray(data) ? data : [] }
    })
  )

  const withReservations = checks.filter((c) => c.reservations.length > 0)
  if (withReservations.length === 0) return []

  // Step 3: fetch full post details only for posts that have reservations
  const results = await Promise.all(
    withReservations.map(async ({ postId, reservations }) => {
      const postRes = await fetch(`${BASE_URL}/api/Posts/${postId}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      })
      if (!postRes.ok) return []
      const p: any = await postRes.json()

      return reservations.map((r) => ({
        id: r.id,
        arrival_date: r.arrival_date,
        departure_date: r.departure_date,
        post: {
          id: postId,
          title: p.title || p.Title || '',
          photo: p.house_pictures?.[0]?.URL || null,
          price: p.house?.Price || 0,
          wilaya: p.location?.State || '',
          rating: p.rating || 0,
          seller: {
            id: p.seller?.id ?? 0,
            full_name: p.seller?.full_name || '—',
            email: p.seller?.email || '—',
          },
        },
      }))
    })
  )

  return results.flat()
}
