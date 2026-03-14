'use client'
import { useState } from 'react'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'

const STAR_LOGO =<svg width="27" height="27" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" fill="black"/>
</svg>

const STAR_LOGO_SMALL =<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="15"
     height="15">
  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" fill="black"/>
</svg>


function comments_invisible(setShowComments:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <div className={style.nook_data}>
          <div className={style.nook_and_renter_rating}>
            <div className={style.rating_display}>
              <div className={style.rating_and_ratingButton_container}>
                <div onClick={()=>setShowComments((prev)=>!prev)} className={style.nook_rating_and_comments}>
                    <div className={style.nook_rating_value}>
                      4,93
                      {STAR_LOGO}
                    </div>
                    <div className={style.comments_number}>
                      3<br/><span>Comments</span>
                    </div>

                </div>
                <div className={style.rating_button}>Rate the nook</div>

              </div>
              {/* this will be a component */}
              <div className={style.rating_and_ratingButton_container}>
                <div className={style.renter_rating}>
                  <div className={style.profile_picture}></div>
                  <div className={style.name_rating_container}>
                    <div className={style.name_container}>
                      Renter : Benmoati Seddik Bilal
                    </div>
                    <div className={style.rating_container}>
                      4,10
                      {STAR_LOGO_SMALL}
                    </div>
                  </div>
                </div>
                <div className={style.rating_button}>Rate the renter</div>
              </div>
            </div>
            
          </div>
        </div>
  )
}

function comments_visible(setShowComments:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <div className={style.nook_comments}>
          <div className={style.nook_and_renter_rating}>
            <div className={style.rating_display}>
                <div style={{
                  maxHeight:"93px"
                }} onClick={()=>setShowComments((prev)=>!prev)} className={style.nook_rating_and_comments}>
                    <div className={style.nook_rating_value}>
                      4,93
                      {STAR_LOGO}
                    </div>
                    <div className={style.comments_number}>
                      3<br/><span>Comments</span>
                    </div>
                </div>
              {/* this will be a component */}
              <div className={style.rating_and_ratingButton_container}>
                <div className={style.renter_rating}>
                </div>
              </div>
            </div>
            
          </div>
        </div>
  )
}

export default function HouseInformationAndBooking(){
  const [showComments, setShowComments] = useState(false);
  return(
    <section className={style.nook_data_and_scheduler}>
        {!showComments?comments_invisible(setShowComments):comments_visible(setShowComments)}
        <div className={style.nook_scheduler}>
          date picker here
        </div>
      </section>
  )
}