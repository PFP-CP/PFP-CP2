'use client'
import { ChangeEvent, useState } from 'react'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { STAR_LOGO,STAR_LOGO_SMALL,LEAVE_TAB,CONFIRM } from '@/public/svg/svg'
import Comment from './house_information_components/Comment'
import { Slider } from '@mui/material'

let user = {
  renterRated:false,
  renterRate:3,
}

function RateRenterButton(){
  const [isRating, setIsRating] = useState(false);
  const [value, setValue] = useState(user.renterRate);
  const [IsRenterRated, setIsRenterRated] = useState(user.renterRated); // this has to be taken from api

  const handleValueChange = (e:Event, ratingValue:number)=>{
    setValue(ratingValue);
  }
  const handleSubmitRating = ()=>{
    setIsRenterRated(true);
    setIsRating(false);
    user.renterRate=value;
    user.renterRated=true;
  };
  return(
    !isRating?
      (!IsRenterRated?<div onClick={()=> setIsRating(true)} className={style.rating_button}>Rate the renter</div>:
        <div onClick={()=> setIsRating(true)} className={style.rated_button}>{value.toFixed(2)} {STAR_LOGO_SMALL}</div>):
    <div className={style.rating_slider_container}>
      <Slider
        className={style.rating_slider}
        onChange={handleValueChange}
        value={value}
        valueLabelDisplay="on"
        aria-label="rating"
        defaultValue={0}
        step={0.5}
        marks
        min={0}
        max={5}
      />
      <button className={style.confirm_rating_button} onClick={handleSubmitRating}>{CONFIRM}</button>
    </div>
  )
}

function RateNookButton({setRatingValue}:{setRatingValue:React.Dispatch<React.SetStateAction<number | undefined>>}){
  const [isRating, setIsRating] = useState(true);
  const [value, setValue] = useState(0);
  const [isNookRated, setIsNookRated] = useState(false); // this has to be taken from api
  console.log(value);
  const handleValueChange = (e:Event, rating:number)=>{
    setValue(rating);
  }
  const handleSubmitRating = ()=>{
    setIsNookRated(true);
    setIsRating(false);
    setRatingValue(value);
  };
  return(
    
      !isRating && isNookRated?
        <div onClick={()=> setIsRating(true)} className={style.rated_button}>{value.toFixed(2)} {STAR_LOGO_SMALL}</div>:
    <div className={style.rating_slider_container}>
      <Slider
        className={style.rating_slider}
        onChange={handleValueChange}
        value={value}
        valueLabelDisplay="on"
        aria-label="rating"
        defaultValue={0}
        step={0.5}
        marks
        min={0}
        max={5}
      />
      <button className={style.confirm_rating_button} onClick={handleSubmitRating}>{CONFIRM}</button>
    </div>
  )
}

function Comment_review({setIsCommenting, setRatingValue}:{setIsCommenting:React.Dispatch<React.SetStateAction<boolean>>, setRatingValue:React.Dispatch<React.SetStateAction<number | undefined>>}){
  const handleCloseSubmit = ()=>{
    setIsCommenting(false);
  }
  
  return(
    <div className={style.nook_review}>
      <div className={style.nook_rating_and_close_button}>
        {<RateNookButton setRatingValue={setRatingValue} />}
        <button onClick={handleCloseSubmit} className={style.close_button}>Close</button>
      </div>
      <div className={style.comment_input}>
        <textarea name="comment" id={style.comment} placeholder='Write your comment'></textarea>
        <button onClick={handleCloseSubmit}>Submit</button>
      </div>
    </div>
  )
}

function comments_invisible(setShowComments:React.Dispatch<React.SetStateAction<boolean>>){
  const [isCommenting, setIsCommenting] = useState(false);
  const [ratingValue,setRatingValue] = useState<number>();
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
                {!isCommenting && (
                  !ratingValue?
                  <div onClick={()=>setIsCommenting(true)} className={style.rating_button}>Rate the nook</div>:
                  <div onClick={()=> setIsCommenting(true)} className={style.rated_button}>{ratingValue.toFixed(2)} {STAR_LOGO_SMALL}</div>
                  )}

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
                {!isCommenting && <RateRenterButton />}
              </div>
            </div>
            {isCommenting && <Comment_review setIsCommenting={setIsCommenting} setRatingValue={setRatingValue}/>}
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