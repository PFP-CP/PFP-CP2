'use client'
import style from '@/styles/create_post_page_styles/create_post_page.module.css'
import Uploader from "@/components/create_post_page_components/image_uploader";

export default function CreatePostMobile() {
  return (
    <div className={style.create_post_page_container}>
      <Uploader/>

    </div>
  );
}