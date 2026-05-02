import { getRecommendedPosts, getPostsByWilaya } from './actions'
import HomeClient from './HomeClient'
import { Property } from '@/types/api_types'

const WILAYAS = [
  { code: "16", name: "Algiers" },
  { code: "31", name: "Oran" },
  { code: "09", name: "Blida" },
  { code: "21", name: "Skikda" },
]

export default async function HomePage() {
  const [recommended, ...wilayaResults] = await Promise.all([
    getRecommendedPosts(),
    ...WILAYAS.map((w) => getPostsByWilaya(w.code)),
  ])

  const wilayaPosts: Record<string, Property[]> = {}
  WILAYAS.forEach((w, i) => { wilayaPosts[w.name] = wilayaResults[i] })

  return <HomeClient recommended={recommended} wilayaPosts={wilayaPosts} wilayaNames={WILAYAS.map(w => w.name)} />
}
