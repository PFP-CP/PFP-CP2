'use client'
import { useState } from 'react'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { STAR_LOGO,STAR_LOGO_SMALL,LEAVE_TAB } from '@/public/svg/svg'
import Comment from './house_information_components/Comment'




function comments_invisible(setShowComments:React.Dispatch<React.SetStateAction<boolean>>){
  return(
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
  )
}

function comments_visible(setShowComments:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    
          <div className={style.nook_and_renter_rating}>
            <div className={`${style.rating_display} ${style.rating_display_onCommentsShow}`}>
                <div onClick={()=>setShowComments((prev)=>!prev)} className={`${style.nook_rating_and_comments} ${style.nook_rating_and_comments_onCommentsShow}`}>
                    <div className={style.nook_rating_value}>
                      4,93
                      {STAR_LOGO}
                    </div>
                    <div className={style.comments_number}>
                      3<br/><span>Comments</span>
                    </div>
                </div>
                <div className={style.wrapper}>
                  <div className={style.comments_container}>
                    <Comment />
                    <Comment />
                    <Comment />
                    <Comment />
                    <Comment />
                  </div>
                <button className={style.leave_show_comments} onClick={()=>setShowComments(false)}>{LEAVE_TAB}</button>
                </div>
              {/* this will be a component */}
              
            </div>
            
          </div>
  )
}

export default function HouseInformationAndBooking(){
  const [showComments, setShowComments] = useState(false);
  return(
    <section className={style.nook_data_and_scheduler}>
        <div className={style.nook_data}>
          {!showComments?comments_invisible(setShowComments):comments_visible(setShowComments)}
        </div>
        <div className={style.nook_scheduler}>
          date picker here
        </div>
      </section>
  )
}