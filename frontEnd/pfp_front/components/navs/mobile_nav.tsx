'use client'
import style from '@/styles/nav_bar_styles/nav_bar_mobile.module.css'
import {useLayoutEffect,useState,useRef} from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { logout } from '@/app/(authentication)/actions/login'
import { motion } from "framer-motion";

const SEARCH_ICON = (
  <svg className={style.search_logo} width="9" height="9" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8333 15.8333L22.5 22.5M10.2778 18.0556C5.98223 18.0556 2.5 14.5733 2.5 10.2778C2.5 5.98223 5.98223 2.5 10.2778 2.5C14.5733 2.5 18.0556 5.98223 18.0556 10.2778C18.0556 14.5733 14.5733 18.0556 10.2778 18.0556Z" stroke="#220E67" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

)

const LOGO = (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.9248 3.87489C12.0044 2.92435 10.4799 2.92435 9.55954 3.87489L5.06411 8.51764C4.80593 8.78428 4.63244 9.12137 4.56549 9.48643C4.01954 12.4637 3.97924 15.5117 4.44629 18.5023L4.61164 19.5612C4.66387 19.8956 4.95192 20.1422 5.29041 20.1422H8.43161C8.69032 20.1422 8.90004 19.9324 8.90004 19.6737V13.1158H13.5843V19.6737C13.5843 19.9324 13.794 20.1422 14.0527 20.1422H17.1939C17.5323 20.1422 17.8204 19.8956 17.8726 19.5612L18.038 18.5023C18.505 15.5117 18.4647 12.4637 17.9188 9.48643C17.8518 9.12137 17.6783 8.78428 17.4202 8.51764L12.9248 3.87489Z" fill="#220E67"/>
</svg>

)

const NOOK = (
  <Image src={"/logo/image.svg"} fill style={{objectFit:'contain'}} alt='brand_name'/>
)

const USER_ICON = (
  <svg className={style.user_profile} width="19" height="19" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5003 17.4998C21.5836 17.4998 24.792 14.2915 24.792 10.2082C24.792 6.12484 21.5836 2.9165 17.5003 2.9165C13.417 2.9165 10.2086 6.12484 10.2086 10.2082C10.2086 14.2915 13.417 17.4998 17.5003 17.4998ZM31.0628 30.3332C29.167 22.8957 21.5836 18.229 14.1461 20.1248C9.18779 21.4373 5.25029 25.229 3.93779 30.3332C3.79196 31.0623 4.22946 31.9373 5.10446 32.0832C5.25029 32.0832 5.39613 32.0832 5.39613 32.0832H29.6045C30.4795 32.0832 31.0628 31.4998 31.0628 30.6248C31.0628 30.479 31.0628 30.3332 31.0628 30.3332Z" fill="#220E67"/>
  </svg>

)

const SETTINGS = (
  <svg onClick={()=> logout()} className={style.settings} width="19" height="19" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.6064 2.91699C19.4667 2.91699 19.8969 2.91724 20.1826 3.17578C20.4683 3.43439 20.5112 3.86266 20.5967 4.71875L20.6533 5.28223C20.8164 6.91561 20.8976 7.73276 21.4502 7.96191C22.0029 8.19097 22.6386 7.67112 23.9092 6.63184L24.3496 6.27148C25.015 5.72722 25.3478 5.45548 25.7324 5.47461C26.1171 5.49382 26.4214 5.79735 27.0293 6.40527L28.5938 7.96973C29.202 8.57803 29.5062 8.88272 29.5254 9.26758C29.5445 9.65231 29.2721 9.98489 28.7275 10.6504L28.3691 11.0898C27.3296 12.3601 26.8093 12.9951 27.0381 13.5479C27.267 14.1007 28.0844 14.1821 29.7178 14.3457L30.2822 14.4023C31.138 14.488 31.5657 14.5317 31.8242 14.8174C32.0826 15.103 32.083 15.5327 32.083 16.3926V18.6064C32.083 19.4667 32.0828 19.8969 31.8242 20.1826C31.5656 20.4683 31.1373 20.5112 30.2812 20.5967L29.7188 20.6533C28.0854 20.8164 27.2684 20.8978 27.0391 21.4502C26.81 22.003 27.3295 22.6385 28.3691 23.9092L28.7285 24.3486C29.2728 25.0139 29.5445 25.3468 29.5254 25.7314C29.5062 26.1162 29.2028 26.4211 28.5947 27.0293L27.0303 28.5938C26.422 29.2021 26.1173 29.5062 25.7324 29.5254C25.3476 29.5445 25.0144 29.2722 24.3486 28.7275L23.9092 28.3682C22.6386 27.3286 22.003 26.809 21.4502 27.0381C20.8977 27.2674 20.8164 28.0843 20.6533 29.7178L20.5967 30.2812C20.5112 31.1374 20.4683 31.5656 20.1826 31.8242C19.8969 32.0828 19.4667 32.083 18.6064 32.083H16.3926C15.5327 32.083 15.103 32.0826 14.8174 31.8242C14.5317 31.5657 14.488 31.138 14.4023 30.2822L14.3457 29.7178C14.1821 28.0844 14.1007 27.267 13.5479 27.0381C12.9951 26.8093 12.3601 27.3296 11.0898 28.3691L10.6504 28.7275C9.98489 29.2721 9.65231 29.5445 9.26758 29.5254C8.88272 29.5062 8.57802 29.202 7.96973 28.5938L6.40527 27.0293C5.79735 26.4214 5.49382 26.1171 5.47461 25.7324C5.45548 25.3478 5.72722 25.015 6.27148 24.3496L6.63184 23.9092C7.67112 22.6386 8.19097 22.0029 7.96191 21.4502C7.73276 20.8976 6.91561 20.8164 5.28223 20.6533L4.71875 20.5967C3.86266 20.5112 3.43439 20.4683 3.17578 20.1826C2.91724 19.8969 2.91699 19.4667 2.91699 18.6064V16.3926C2.91699 15.5327 2.91736 15.103 3.17578 14.8174C3.43431 14.5317 3.86201 14.4889 4.71777 14.4033L5.28223 14.3467C6.91574 14.1834 7.73291 14.1016 7.96191 13.5488C8.1909 12.996 7.67129 12.3604 6.63184 11.0898L6.27148 10.6504C5.72717 9.98508 5.45555 9.65221 5.47461 9.26758C5.49378 8.88278 5.79717 8.57797 6.40527 7.96973L7.9707 6.40527C8.57885 5.79698 8.88276 5.49288 9.26758 5.47363C9.65234 5.45446 9.98563 5.72598 10.6514 6.27051L11.0898 6.62988C12.3604 7.6691 12.9961 8.18896 13.5488 7.95996C14.1015 7.73093 14.1833 6.91438 14.3467 5.28125L14.4033 4.71777C14.4889 3.862 14.5317 3.4343 14.8174 3.17578C15.103 2.91737 15.5327 2.91699 16.3926 2.91699H18.6064ZM17.5 11.667C14.2783 11.667 11.667 14.2783 11.667 17.5C11.667 20.7217 14.2783 23.333 17.5 23.333C20.7217 23.333 23.333 20.7217 23.333 17.5C23.333 14.2783 20.7217 11.667 17.5 11.667Z" fill="#220E67"/>
  </svg>

)
function getPathName(){
  return usePathname().split('/')[1] as nav_link_names;
}


const tabs = ["Home", "My Nooks", "My Reservations", "My Favorites"];

export default function Mobile_nav(){
  const [current_page,set_current_page]=  useState(getPathName()); 
  let activeTab:string;
  switch (current_page) {
    case "home":
      activeTab = tabs[0];
      break;
    case "mynooks":
      activeTab = tabs[1];
      break;
    case "myreservations":
      activeTab = tabs[2];
      break;
    case "myfavorites":
      activeTab = tabs[3];
      break;
    default:
      break;
  }
  
  return (
    <>  
        <nav id={style.navbar}>
          <div className={style.upper_container}>
            <div id={style.logo_container}>
              {LOGO}
              <div style={{position:'relative', height:'14px', width:'50px'}}>
               {NOOK}
              </div>
            </div>
            
            
            <div className={style.nav_search} >
                {SEARCH_ICON}
              <div className={style.find_retals_h3_container}>
                <h3 className={style.find_retals_h3}>Find Retals</h3>
              </div>
            </div>

            <div id={style.user_controls}>
              {USER_ICON}
              {SETTINGS}
            </div>
          </div>

          <div className={style.lower_container}>
            {
              tabs.map((tab)=>{
                let newPath = tab.toLowerCase().split(' ').join('');
                return (
                  <>
                    <div key={tab} onClick={()=>set_current_page(newPath)} className={style.nav_link} id={activeTab===tab?style.active:undefined} >
                      <Link style={{zIndex:'1'}} href={newPath}> {tab} </Link>
                      {activeTab===tab && <motion.div 
                      layoutId="active-pill"
                      className={style.active}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    ></motion.div>}
                    </div>
                    
                  </>
                  )
              })
            }
          </div>
        </nav>
      </>
  );
}