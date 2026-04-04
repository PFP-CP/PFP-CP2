'use client'

import style from '@/styles/create_post_page_styles/create_post_mobile_nav.module.css'
import { useState, useEffect } from 'react';
import {LEAVE_ARROW } from "@/public/svg/svg"
import Link from 'next/link';

export default function Create_post_mobile_nav() {
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

    {screenWidth<700 &&<nav className={style.create_post_mobile_nav}>
          <div className={style.leave_post_container}>
            <div className={style.leave_post_logo}><Link href={"#"}>{LEAVE_ARROW}</Link></div>
          </div>
      
    </nav>}
    </>
    
  );
}