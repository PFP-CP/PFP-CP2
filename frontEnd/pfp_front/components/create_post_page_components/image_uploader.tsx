'use client';
import { useEffect } from 'react';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';

export default function Uploader() {
  useEffect(()=>{
    const upload = new FileUploadWithPreview('nook_images');
    console.log(upload);
  },[])
  return(
    <>
      <div className="custom-file-container" data-upload-id="nook_images"></div>;
      <button onClick={()=> {console.log(upload.cachedFileArray)}}>click me</button>
    </>
  )
}