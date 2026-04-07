'use client'

import style from '@/styles/create_post_page_styles/create_post_mobile_nav.module.css'
import { useState, useEffect } from 'react';
import {LEAVE_ARROW } from "@/public/svg/svg"
import Link from 'next/link';

export default function Create_post_mobile_nav() {
  
  return (

    <>

    <nav className={style.create_post_mobile_nav}>
          <div className={style.leave_post_container}>
            <div className={style.leave_post_logo}><Link href={"#"}>{LEAVE_ARROW}</Link></div>
          </div>
      
    </nav>
    </>
    
  );
}