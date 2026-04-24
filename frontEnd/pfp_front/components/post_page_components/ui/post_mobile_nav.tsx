'use client'

import style from '@/styles/post_page_styles/showcase.module.css'
import { useState } from 'react';
import { SAVE_LOGO_ACTIVE, SAVE_LOGO_INACTIVE, COPY_LINK_LOGO, LEAVE_ARROW } from "@/public/svg/svg"
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Post_mobile_nav({ isSaved, onSaveToggle, lat, lng }: { isSaved: boolean; onSaveToggle: () => void; lat?: number; lng?: number }) {
  const screenWidth = useMediaQuery('(max-width:700px)');
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const hasLocation = lat != null && lng != null && lat !== 0 && lng !== 0;

  const handleCopyLink = () => {
    const url = hasLocation
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {screenWidth && <nav className={style.showcase_header_mobile}>
        <div className={style.showcase_header}>
          <div className={style.leave_post_container} onClick={() => router.back()} style={{ cursor: 'pointer' }}>
            <div className={style.leave_post_logo}>{LEAVE_ARROW}</div>
          </div>
        </div>
        <div className={style.post_actions}>
          <div className={style.save_container} onClick={onSaveToggle} style={{ cursor: 'pointer' }}>
            <div className={style.save_logo}>{isSaved ? SAVE_LOGO_ACTIVE : SAVE_LOGO_INACTIVE}</div>
            <div className={style.save}>{isSaved ? 'Saved' : 'Save'}</div>
          </div>
          <div className={style.copy_link_container} onClick={handleCopyLink}>
            <div className={style.copy_link_logo}>{COPY_LINK_LOGO}</div>
            <div className={style.copy_link}>{copied ? 'Copied!' : 'Copy Link'}</div>
          </div>
        </div>
      </nav>}
    </>
  );
}
