'use client'
import { useEffect, useRef, useState } from 'react'
<<<<<<< Updated upstream
import Link from 'next/link'
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
=======
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { START_LOGO_X_SMALL } from '@/public/svg/svg'
import { deleteComment } from '@/app/(main_page)/(post)/post/[id]/actions/getPost'
import { CommentData } from '@/types/api_types'

const THREE_DOTS = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="19" cy="12" r="2"/>
  </svg>
)

type CommentProps = {
  comment_data: CommentData;
  currentUserId: number | null;
  postId: string;
  onDeleted: () => Promise<void>;
}

export default function Comment({ comment_data, currentUserId, postId, onDeleted }: CommentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwn = currentUserId !== null && comment_data.user_id === currentUserId;

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleDelete = async () => {
    setDeleting(true);
    setMenuOpen(false);
    await deleteComment(postId, comment_data.id);
    await onDeleted();
  };

  return (
    <div className={style.comment} style={{ position: 'relative' }}>
>>>>>>> Stashed changes
      <div className={style.user_container}>
        <Link href={`/profile/${comment_data.commenter?.id ?? comment_data.user_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={style.user_picture_and_name} style={{ cursor: 'pointer' }}>
          {comment_data.commenter?.profile_picture
            ? <img src={comment_data.commenter.profile_picture} alt="profile" className={style.picture} style={{ objectFit: 'cover', borderRadius: '50%' }} />
            : <div className={style.picture} />}
          <div>{comment_data.commenter?.full_name ?? `User #${comment_data.user_id}`}</div>
        </div>
        </Link>
        <div className={style.user_rating_and_date}>
<<<<<<< Updated upstream
          <Stars rating={comment_data.rating} />
          <div className={style.date}>{formatDate(comment_data.created_at)}</div>
=======
          <div className={style.stars}>
            {new Array(Math.floor(Number(comment_data.rating))).fill(START_LOGO_X_SMALL)}
          </div>
          <div className={style.date}>january 2026</div>
>>>>>>> Stashed changes
        </div>
      </div>
      <div className={style.user_comment}>{comment_data.comment}</div>

<<<<<<< Updated upstream
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
=======
      {isOwn && (
        <div ref={menuRef} className={style.comment_menu}>
          <button
            className={style.comment_menu_btn}
            onClick={() => setMenuOpen(prev => !prev)}
            disabled={deleting}
            aria-label="Comment options"
          >
            {THREE_DOTS}
          </button>
          {menuOpen && (
            <div className={style.comment_dropdown}>
              <button className={style.comment_dropdown_delete} onClick={handleDelete}>
                Delete
>>>>>>> Stashed changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
<<<<<<< Updated upstream
  )
=======
  );
>>>>>>> Stashed changes
}
