import { getSellerProfile, getMyProfile } from '@/app/(main_page)/actions/profile'
import SellerProfileClient from './SellerProfileClient'

export default async function SellerProfilePage({ params }: { params: Promise<{ seller_id: string }> }) {
  const { seller_id } = await params

  const [profile, me] = await Promise.all([
    getSellerProfile(seller_id),
    getMyProfile(),
  ])

  if (!profile) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Profile not found.</div>
  }

  const isOwner = me ? String(me.id) === String(seller_id) : false

  return <SellerProfileClient profile={profile} isOwner={isOwner} />
}
