'use client'
import { useEffect, useRef, useState } from 'react'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { START_LOGO_X_SMALL } from '@/public/svg/svg'
import { CommentData } from '@/types/api_types'
import { deleteComment as deleteCommentAction } from '@/app/(main_page)/(post)/post/[id]/actions/getPost'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCommentAction(postId, comment_data.id)
      await onDeleted()
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  const isOwner = currentUserId !== null && currentUserId === comment_data.user_id

  return (
    <div className={style.comment} style={{ position: 'relative', opacity: deleting ? 0.4 : 1, transition: 'opacity 0.2s', pointerEvents: deleting ? 'none' : 'auto' }}>
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

      {isOwner && (
        <div className={style.comment_menu} ref={menuRef}>
          <button
            className={style.comment_menu_btn}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Comment options"
          >
            ···
          </button>
          {menuOpen && (
            <div className={style.comment_dropdown}>
              <button
                className={style.comment_dropdown_delete}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
