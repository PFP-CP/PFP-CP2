'use client'

import style from '@/styles/create_post_page_styles/create_post_mobile_nav.module.css'
import {LEAVE_ARROW } from "@/public/svg/svg"
import { useRouter } from 'next/navigation';

export default function Create_post_mobile_nav() {
  const router = useRouter();

  return (

    <>

    <nav className={style.create_post_mobile_nav}>
          <div className={style.leave_post_container}>
            <div className={style.leave_post_logo}>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {LEAVE_ARROW}
              </button>
            </div>
          </div>

    </nav>
    </>

  );
}