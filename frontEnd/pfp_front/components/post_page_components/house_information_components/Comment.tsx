'use client'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { START_LOGO_X_SMALL } from '@/public/svg/svg'
import { CommentData } from '@/types/api_types'

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <div className={style.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < filled ? 1 : 0.25 }}>
          {START_LOGO_X_SMALL}
        </span>
      ))}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function Comment({
  comment_data,
  currentUserId,
  postId,
  onDeleted,
}: {
  comment_data: CommentData
  currentUserId: number | null
  postId: string
  onDeleted: () => Promise<void>
}) {
  return (
    <div className={style.comment}>
      <div className={style.user_container}>
        <div className={style.user_picture_and_name}>
          <div className={style.picture} />
          <div>User #{comment_data.user_id}</div>
        </div>
        <div className={style.user_rating_and_date}>
          <Stars rating={comment_data.rating} />
          <div className={style.date}>{formatDate(comment_data.created_at)}</div>
        </div>
      </div>
      <div className={style.user_comment}>{comment_data.comment}</div>
    </div>
  )
}
