'use server'
import { SearchCriteria, SearchResult } from '@/types/api_types'

export async function searchPosts(criteria: SearchCriteria): Promise<SearchResult[]> {
  const response = await fetch('http://127.0.0.1:8000/api/Search/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  })

  if (!response.ok) return []
  return response.json()
}
