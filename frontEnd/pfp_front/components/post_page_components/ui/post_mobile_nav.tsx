'use client'

import style from '@/styles/post_page_styles/showcase.module.css'
import { useState, useEffect } from 'react';
import { SAVE_LOGO_ACTIVE, SAVE_LOGO_INACTIVE, COPY_LINK_LOGO, LEAVE_ARROW } from "@/public/svg/svg"
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';

export default function Post_mobile_nav({ isSaved, onSaveToggle }: { isSaved: boolean; onSaveToggle: () => void }) {
  const screenWidth = useMediaQuery(('max-width:700px'));

  return (
    <>
      {screenWidth && <nav className={style.showcase_header_mobile}>
        <div className={style.showcase_header}>
          <div className={style.leave_post_container}>
            <div className={style.leave_post_logo}>{LEAVE_ARROW}</div>
          </div>
        </div>
        <div className={style.post_actions}>
          <div className={style.save_container} onClick={onSaveToggle} style={{ cursor: 'pointer' }}>
            <div className={style.save_logo}>{isSaved ? SAVE_LOGO_ACTIVE : SAVE_LOGO_INACTIVE}</div>
            <div className={style.save}>{isSaved ? 'Saved' : 'Save'}</div>
          </div>
          <div className={style.copy_link_container}>
            <div className={style.copy_link_logo}>{COPY_LINK_LOGO}</div>
            {screenWidth && <div className={style.copy_link}>Copy Link</div>}
          </div>
        </div>
      </nav>}
    </>
  );
}
