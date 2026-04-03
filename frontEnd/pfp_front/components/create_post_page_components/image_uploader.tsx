'use client';
import { useEffect,useState,useRef, ChangeEvent } from 'react';
import style from '@/styles/create_post_page_styles/img_uploader.module.css'
import Image from 'next/image';
import { div } from 'motion/react-client';


const UPLOAD = (<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_143_191)">
<path d="M9 7.12504V11.875M9 11.875L11.25 10.2917M9 11.875L6.75 10.2917M17.25 11.875C17.25 10.1261 15.9069 8.70837 14.25 8.70837C14.2323 8.70837 14.2149 8.70854 14.1973 8.70886C13.8335 6.02306 11.645 3.95837 9 3.95837C6.90251 3.95837 5.09264 5.25674 4.25171 7.1336C2.29655 7.26868 0.75 8.98531 0.75 11.0833C0.75 13.2694 2.42893 15.0418 4.5 15.0418L14.25 15.0417C15.9069 15.0417 17.25 13.6239 17.25 11.875Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_143_191">
<rect width="18" height="19" fill="white"/>
</clipPath>
</defs>
</svg>
)
const REMOVE_IMG = (
  <svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" fill="red" />

  <line x1="30" y1="30" x2="70" y2="70" stroke="white" stroke-width="10" strokeLinecap="round"/>
  <line x1="70" y1="30" x2="30" y2="70" stroke="white" stroke-width="10" strokeLinecap="round"/>
</svg>
)

const ADD_IMG = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_143_204)">
<path d="M5.25 11.6667C5.25 11.9888 5.51117 12.25 5.83333 12.25H8.16667C8.48883 12.25 8.75 11.9888 8.75 11.6667V8.75L11.6667 8.75C11.9888 8.75 12.25 8.48883 12.25 8.16667V5.83333C12.25 5.51117 11.9888 5.25 11.6667 5.25H8.75L8.75 2.33333C8.75 2.01117 8.48883 1.75 8.16667 1.75H5.83333C5.51117 1.75 5.25 2.01117 5.25 2.33333V5.25H2.33333C2.01117 5.25 1.75 5.51117 1.75 5.83333V8.16667C1.75 8.48883 2.01117 8.75 2.33333 8.75H5.25V11.6667Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_143_204">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>

)

const MAX_IMG_SIZE = 10;

function removeAboveTenImages(images:object){
  let imagesKeys = Object.keys(images);
  let newImages = {...images};
  for(let i = imagesKeys.length-1; 10<=i; i--){
    delete newImages[imagesKeys[i]];
  }
  return newImages;
}

type imageItem = {
  id:number;
  file:File;
  url:string;
}

export default function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<imageItem[]>([]);
  const imagesIDs = useRef(0);

  const numberOfEmptyImages = 10-images.length>0?10-images.length:0;
  const arr_numberOfEmptyImages = new Array(numberOfEmptyImages).fill(1);
  
  const saveImages = (e:ChangeEvent)=>{
    let files = Array.from(e.target.files) ?? [];
    
    setImages((prev)=>{
      let newImages = [...prev];
      files.forEach((imgFile:File)=>{
      if(!(newImages.length>=10)){
      newImages.push({
        id:imagesIDs.current++,
        file:imgFile,
        url:URL.createObjectURL(imgFile)
      })}else{
        return;
      }
    }
    )

    return newImages;
    })
    

  }

  const removeImage = (e:React.MouseEvent<HTMLDivElement>)=>{
    const imgId = Number( e.currentTarget.parentElement?.id);
    setImages((prev)=>{
      let removedImg = prev.find((img)=> img.id===imgId)
      if(removeImage) URL.revokeObjectURL(removedImg?.url);
      return prev.filter((img)=> img.id!==imgId)
    })
  }


  return(
    <div className={style.image_uploader_container}>
      <div className={style.upload_button} onClick={()=> inputRef.current?.click()}>
        <div>Click here to upload up to 10 images</div>
        {UPLOAD}
      </div>
      <input style={{display:'none'}} onChange={(e:ChangeEvent)=>saveImages(e)} ref={inputRef} type="file" multiple accept="image/*" />
      {
      images.map((img)=>{
        return <div id={String(img.id)} key={img.id} className={style.image_and_svg_container}>
        
          <div className={style.uploader_image_container} >
            <Image className={style.uploader_image} src={img.url} fill style={{objectFit:'cover'}} id={img.id} alt="image" />
          </div>
          <div className={style.remove_image_container} onClick={(e)=> removeImage(e)}> {REMOVE_IMG} </div>
        </div>
      })
    }
      {
      arr_numberOfEmptyImages.map((t,i)=>{
        return (
          <div key={i} onClick={()=> inputRef.current?.click()} className={style.image_and_svg_container}>
            <div className={style.uploader_image_container_empty} >
              {ADD_IMG}
            </div>
          </div>
        )
      })
      }
      
    </div>
  )
}

