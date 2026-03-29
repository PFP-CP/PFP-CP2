"use client";
import style from "@/styles/post_page_styles/carousel.module.css"

import { useEffect, useRef,useState } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Image from "next/image";


const RIGHT_ARROW = <svg xmlns="http://www.w3.org/2000/svg"
     width="70" height="70"
     viewBox="0 0 24 24"
     fill="none"
     stroke="white"
     strokeWidth="3.5"
     strokeLinecap="round"
     strokeLinejoin="round">
  <polyline points="9 18 15 12 9 6"></polyline>
</svg>

const LEFT_ARROW = <svg xmlns="http://www.w3.org/2000/svg"
     width="70" height="70"
     viewBox="0 0 24 24"
     fill="none"
     stroke="white"
     stroke-width="3.5"
     stroke-linecap="round"
     stroke-linejoin="round">
  <polyline points="15 18 9 12 15 6"></polyline>
</svg>

export default function CarouselImages() {
  const glideRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
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
  const mock_pictures = ['1','5','4','3','6']

  useEffect(()=>{
    if (!glideRef.current) return;

    const glide = new Glide(glideRef.current, {
      type: "carousel",
      perView:3,
      bound: true,
      breakpoints:{
        900:{perView:2},
        600:{perView:1}
      }
    });

    glide.mount();

    return () => {glide.destroy()};
  }, [screenWidth]);

  return (
    <div className={`glide ${style.glide_container}`} ref={glideRef}>
      <div className="glide__track" data-glide-el="track">
        <ul className="glide__slides"
        style={{
          
        }}
        >
          {mock_pictures.map((pic)=>{
            return(
              <PhotoProvider key={pic}>
                

                <li 
                style={{ position: "relative", height: "300px" }}
                className="glide__slide" key={pic}
                >
                <PhotoView src={`/mock_data/picture${pic}.png`}>
                  <Image src={`/mock_data/picture${pic}.png`} alt="side_picture" fill style={{ objectFit: "cover", borderRadius: "8px" }}/>
                </PhotoView>
                </li>
              </PhotoProvider>

                  )
                })}
        </ul>
      </div>

      {screenWidth>=700 && <div className="glide__arrows" data-glide-el="controls">
        <button className={`${style.carousel_buttons} ${style.left}`} data-glide-dir="<">{LEFT_ARROW}</button>
        <button  className={`${style.carousel_buttons} ${style.right}`} data-glide-dir=">">{RIGHT_ARROW}</button>
      </div>}
    </div>
  );
}