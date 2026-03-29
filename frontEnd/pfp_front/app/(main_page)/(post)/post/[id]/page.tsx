'use client'
import PostShowcase from "@/components/post_page_components/post_showcase"
import HouseInformationAndBooking from "@/components/post_page_components/house_information_and_booking";
import { useState } from "react";
import Post_mobile_nav from "@/components/post_page_components/ui/mobile_post";
import style from '@/styles/post_page_styles/general.module.css'
export default function PostPage() {
  const [show_pictures,setShowPictures] = useState(false);
  return (
  <>  
    <Post_mobile_nav/>
    <main className={style.post_page_main}>
      <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} />

      {!show_pictures&&<HouseInformationAndBooking />}
    </main>
  </>
  );
}