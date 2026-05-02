import { getPost, getCurrentUserId, checkIsSaved, getMyReservationsForPost } from './actions/getPost'
import PostPageClient from './PostPageClient'
import { notFound } from 'next/navigation'
import { PostData } from '@/types/api_types'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [postRaw, currentUserId, isSaved, reservations] = await Promise.all([
    getPost(id).catch(() => null),
    getCurrentUserId(),
    checkIsSaved(id),
    getMyReservationsForPost(id),
  ])

  if (!postRaw) notFound()

  const postData: PostData = { ...postRaw, comment_list: postRaw.comments ?? [] }

  return (
    <PostPageClient
      initialPostData={postData}
      currentUserId={currentUserId}
      initialIsSaved={isSaved}
      initialReservations={reservations}
    />
  )
}
