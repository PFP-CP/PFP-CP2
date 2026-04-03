'use client'
import style from '@/styles/create_post_page_styles/create_post_page.module.css'
import Uploader from "@/components/create_post_page_components/image_uploader";

function compressImages(file:File, maxWidth = 1200, quality = 0.8){
  return new Promise((resolve) =>{
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload= ()=>{
      const scale= Math.min(1, maxWidth/img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/webp", quality);
      URL.revokeObjectURL(url);
    }
  })
}

export default function CreatePostMobile() {
  return (
    <div className={style.create_post_page_container}>
      <Uploader/>

    </div>
  );
}