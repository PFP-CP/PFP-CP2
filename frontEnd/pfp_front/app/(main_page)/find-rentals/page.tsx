import { searchPosts } from './actions/search'
import FindRentalsClient from './FindRentalsClient'
import { SearchResult } from '@/types/api_types'

export default async function FindRentalsPage() {
  const initialResults = await searchPosts({ features: [], rules: [], order_by: 'newest' }).catch(() => [] as SearchResult[])
  return <FindRentalsClient initialResults={initialResults} />
}
