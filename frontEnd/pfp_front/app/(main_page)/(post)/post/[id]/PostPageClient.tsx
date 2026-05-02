'use client'

import PostShowcase from '@/components/post_page_components/post_showcase'
import HouseInformationAndBooking from '@/components/post_page_components/house_information_and_booking'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Post_mobile_nav from '@/components/post_page_components/ui/post_mobile_nav'
import style from '@/styles/post_page_styles/general.module.css'
import { savePost, unsavePost } from './actions/getPost'
import { PostData } from '@/types/api_types'

type MyReservation = { id: number; arrival_date: string; departure_date: string }

type Props = {
  initialPostData: PostData
  currentUserId: number | null
  initialIsSaved: boolean
  initialReservations: MyReservation[]
}

export default function PostPageClient({ initialPostData, currentUserId, initialIsSaved, initialReservations }: Props) {
  const router = useRouter()
  const [show_pictures, setShowPictures] = useState(false)
  const [isSaved, setIsSaved] = useState(initialIsSaved)

  const handleSaveToggle = async () => {
    const newSaved = !isSaved
    setIsSaved(newSaved)
    const res = newSaved ? await savePost(initialPostData.id) : await unsavePost(initialPostData.id)
    if (!res.success) setIsSaved(!newSaved)
  }

  const refetchPost = async () => {
    router.refresh()
  }

  return (
    <>
      <Post_mobile_nav isSaved={isSaved} onSaveToggle={handleSaveToggle} lat={initialPostData.location?.Latitude} lng={initialPostData.location?.Longitude} />
      <main className={style.post_page_main}>
        <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} post_data={initialPostData} isSaved={isSaved} onSaveToggle={handleSaveToggle} />
        {!show_pictures && (
          <HouseInformationAndBooking
            post_data={initialPostData}
            onCommentAdded={refetchPost}
            onReservationCreated={refetchPost}
            currentUserId={currentUserId}
            initialReservations={initialReservations}
          />
        )}
      </main>
    </>
  )
}
