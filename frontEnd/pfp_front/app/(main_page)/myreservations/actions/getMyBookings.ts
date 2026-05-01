'use server'
import { BookedReservation } from '@/types/api_types'
import { authedFetch } from '@/lib/authorization_handling'

export async function getMyBookings(): Promise<BookedReservation[]> {
  // Step 1: saved posts — making a reservation auto-saves the post
  const savedRes = await authedFetch('/api/Posts/saved', { method: 'GET', cache: 'no-store' })
  const savedPosts: { post_id: string }[] = await savedRes.json()
  if (savedPosts.length === 0) return []

  // Step 2: check each saved post for reservations by the current user
  const checks = await Promise.all(
    savedPosts.map(async ({ post_id }) => {
      try {
        const res = await authedFetch(`/api/Reservations/post/${post_id}`, { method: 'GET', cache: 'no-store' })
        const data = await res.json()
        return { postId: post_id, reservations: Array.isArray(data) ? data : [] as { id: number; arrival_date: string; departure_date: string }[] }
      } catch {
        return { postId: post_id, reservations: [] as { id: number; arrival_date: string; departure_date: string }[] }
      }
    })
  )

  const withReservations = checks.filter((c) => c.reservations.length > 0)
  if (withReservations.length === 0) return []

  // Step 3: fetch full post details only for posts that have reservations
  const results = await Promise.all(
    withReservations.map(async ({ postId, reservations }) => {
      try {
        const postRes = await authedFetch(`/api/Posts/${postId}`, { method: 'GET', cache: 'no-store' })
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
      } catch {
        return []
      }
    })
  )

  return results.flat()
}
