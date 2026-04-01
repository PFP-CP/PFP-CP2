'use client'

import style from '@/styles/post_page_styles/showcase.module.css'
import { useState, useEffect } from 'react';
import { SAVE_LOGO_ACTIVE, COPY_LINK_LOGO, LEAVE_ARROW } from "@/public/svg/svg"
import Link from 'next/link';

export default function Post_mobile_nav() {
  const [screenWidth, setScreenWidth] = useState(0);
    
      useEffect(()=>{
        setScreenWidth(window.innerWidth);
        let timeId : NodeJS.Timeout | null = null;;
        const handleResize = ()=> {
          
          if(timeId) return;
    
          timeId =  setTimeout(()=>{
            setScreenWidth(window.innerWidth);
            timeId = null;
    
          },300)
        }
        window.addEventListener('resize', handleResize);
        return ()=> {
          removeEventListener('resize', handleResize);
          if(timeId) clearTimeout(timeId);
        }
      },[])
  return (

    <>

    {screenWidth<700 &&<nav className={style.showcase_header_mobile}>
      <div className={style.showcase_header}>
          <div className={style.leave_post_container}>
            <div className={style.leave_post_logo}><Link href={"#"}>{LEAVE_ARROW}</Link></div>
          </div>
      </div>
      <div className={style.post_actions}>
            <div className={style.save_container}>
              <div className={style.save_logo}>{SAVE_LOGO_ACTIVE}</div>
               <div className={style.save}>Save</div>
            </div>
            <div className={style.copy_link_container}>
              <div className={style.copy_link_logo}>{COPY_LINK_LOGO}</div>
              {screenWidth<700 &&  <div className={style.copy_link}>Copy Link</div>}
            </div>
          </div>
    </nav>}
    </>
    
  );
}
