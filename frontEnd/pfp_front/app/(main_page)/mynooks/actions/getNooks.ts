'use server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get('token')?.value
  const response = await fetch(`http://127.0.0.1:8000${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (response.status === 401) throw new Error('401')
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response
}

export async function getMyNooks() {
  const profileRes = await authedFetch('/api/Account/my-profile/', { cache: 'no-store' })
  const profile = await profileRes.json()
  if (!profile?.id) return []

  const [nooksRes, reservationsRes] = await Promise.all([
    authedFetch(`/api/Mynook/profile/${profile.id}`, { cache: 'no-store' }),
    authedFetch('/api/Reservations/', { cache: 'no-store' }).catch(() => null),
  ])

  const publicProfile = await nooksRes.json()
  if (!publicProfile?.nooks) return []

  const reservations: any[] = reservationsRes
    ? await reservationsRes.json().catch(() => [])
    : []

  const today = new Date().toISOString().split('T')[0]

  return (publicProfile.nooks as any[]).map((nook) => {
    const active = Array.isArray(reservations)
      ? reservations.find(
          (r: any) =>
            r.post?.id === nook.id &&
            r.arrival_date <= today &&
            today < r.departure_date
        )
      : null

    return {
      id: nook.id,
      title: nook.title,
      primary_image: nook.primary_image || nook.image,
      price: nook.price_per_night || nook.price || nook.Price || 0,
      average_rating: nook.rating || nook.average_rating || 0,
      state: nook.wilaya || nook.state || '—',
      status: active ? 'reserved-today' : 'available',
      tenant: active
        ? {
            id: active.renter?.id ?? null,
            name: active.renter?.full_name || null,
            mobile: active.renter?.phone || null,
            email: active.renter?.email || null,
          }
        : null,
    }
  })
}

export async function deleteNook(id: string) {
  await authedFetch(`/api/Mynook/${id}`, { method: 'DELETE' })
  revalidateTag('my-nooks')
}
