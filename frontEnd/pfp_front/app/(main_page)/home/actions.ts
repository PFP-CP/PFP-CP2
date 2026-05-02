'use server'

import { cookies } from 'next/headers';
import { Property } from '@/types/api_types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function mapPost(item: any): Property {
  return {
    id: item.id,
    title: item.title,
    price: Number(item.Price ?? item.price ?? 0),
    state: item.State ?? item.state ?? '',
    average_rating: Number(item.average_rating ?? 0),
    primary_image: item.primary_image ?? null,
    status: 'available',
  };
}

async function authFetch(path: string): Promise<any[]> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.status === 401 || !res.ok) return [];
    const data = await res.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

export async function getRecommendedPosts(): Promise<Property[]> {
  const data = await authFetch('/api/Recommendations/recommended');
  return data.map(mapPost);
}

export async function getPostsByWilaya(code: string, limit = 10): Promise<Property[]> {
  // sort_by=none bypasses a backend sorting bug (sorting() expects dicts but gets model instances)
  console.log(code);
  const data = await authFetch(`/api/Posts/?city=${code}`);
  return data.map(mapPost);
}
