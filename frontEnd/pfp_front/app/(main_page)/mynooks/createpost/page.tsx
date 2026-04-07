'use client'
import { useEffect, useState } from "react";
import CreatePostMobile from "./create_post_mobile";
import CreatePostComputer from "./create_post_computer";
export default function Home() {
  const [screenWidth, setScreenWidth] = useState(()=>window.innerWidth);
        useEffect(()=>{
          console.log(screenWidth)
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
        },[screenWidth])
  return (

    <>{screenWidth>=850 ? <CreatePostComputer />:<CreatePostMobile/>}</>
  );
}