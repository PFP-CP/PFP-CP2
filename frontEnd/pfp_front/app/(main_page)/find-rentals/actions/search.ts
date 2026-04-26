'use server'
import { SearchCriteria, SearchResult } from '@/types/api_types'

export async function searchPosts(criteria: SearchCriteria): Promise<SearchResult[]> {
  const ap = criteria.allowed_people
  const noneSelected = ap && !ap.Families && !ap.Couple && !ap.Single

  const payload = {
    ...criteria,
    // send null (not undefined) when no filter — backend accepts null as None and skips the filter
    allowed_people: (!ap || noneSelected) ? null : criteria.allowed_people,
    // posts are titled "apartment in X" (lowercase) — match case-insensitively
    house_type: criteria.house_type?.toLowerCase() || undefined,
  }

  const response = await fetch('http://127.0.0.1:8000/api/Search/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '(unreadable)')
    console.error(`Search failed ${response.status}:`, body)
    return []
  }
  return response.json()
}
