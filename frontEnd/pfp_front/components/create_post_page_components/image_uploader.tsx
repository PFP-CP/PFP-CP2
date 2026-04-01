'use client';
import { useEffect,useState,useRef, ChangeEvent } from 'react';
import style from '@/styles/create_post_page_styles/img_uploader.module.css'


export default function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<object>({});
  const imagesIDs = useRef(0);
  const saveImages = (e:ChangeEvent)=>{
    Object.keys(e.target.files).forEach((img)=>{
      setImages((prev)=>{return {...prev,[imagesIDs.current]:e.target.files[img]}});
      imagesIDs.current++;
    })
  }
  console.log(images);
  return(
    <>
      <div className={style.cu} onClick={()=> inputRef.current?.click()}>click</div>
      <input style={{display:'none'}} onChange={(e:ChangeEvent)=>saveImages(e)} ref={inputRef} type="file" multiple={true} />
      {
      Object.keys(images).map((imgKey)=>{
        return <img key={imgKey} src={URL.createObjectURL(images[imgKey])} id={imgKey} alt="image" />
      })
      }
    </>
  )
}

