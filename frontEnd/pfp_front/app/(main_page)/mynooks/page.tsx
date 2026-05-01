import { getMyNooks } from './actions/getNooks'
import MyNooksClient from './MyNooksClient'
import { redirect } from 'next/navigation'
import { Property } from '@/types/api_types'

export default async function MyNooksPage() {
    let nooks: Property[] = []
    try {
        nooks = await getMyNooks()
    } catch (err: any) {
        if (String(err?.message).includes('401')) redirect('/authentication')
    }
    return <MyNooksClient initialNooks={nooks} />
}
