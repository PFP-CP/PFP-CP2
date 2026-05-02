'use client'
import { ChangeEvent, useState,useRef, useEffect } from 'react'
import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { STAR_LOGO,STAR_LOGO_SMALL,LEAVE_TAB,CONFIRM, LEAVE_TAB_WHITE, FEATURE_ICONS } from '@/public/svg/svg'
import Comment from './house_information_components/Comment'
import { Slider, useMediaQuery } from '@mui/material'
import MyDatePicker from './ui/date_picker'
import CarouselImages from "./carousel_images"
import Image from 'next/image'
import Link from 'next/link'
import { addComment, cancelReservation, createReservation, rateSeller, updateComment } from '@/app/(main_page)/(post)/post/[id]/actions/getPost'




const ALLOW = <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M33 16.5C33 25.6127 25.6127 33 16.5 33C7.3873 33 0 25.6127 0 16.5C0 7.3873 7.3873 0 16.5 0C25.6127 0 33 7.3873 33 16.5ZM24.8125 10.2499C24.2084 9.64585 23.229 9.64585 22.6249 10.2499C22.6103 10.2645 22.5966 10.28 22.5839 10.2962L15.4221 19.422L11.1042 15.1041C10.5002 14.5001 9.52073 14.5001 8.91663 15.1041C8.31254 15.7082 8.31254 16.6877 8.91663 17.2918L14.3749 22.7501C14.979 23.3541 15.9585 23.3541 16.5625 22.7501C16.576 22.7366 16.5887 22.7224 16.6006 22.7076L24.8345 12.4152C25.4165 11.8095 25.4092 10.8466 24.8125 10.2499Z" fill="#12860C"/>
</svg>

const NOT_ALLOW = <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_506_984)">
<path d="M33 16.5C33 25.6127 25.6127 33 16.5 33C7.3873 33 0 25.6127 0 16.5C0 7.3873 7.3873 0 16.5 0C25.6127 0 33 7.3873 33 16.5ZM11.0417 9.5833C10.639 9.18057 9.98602 9.18057 9.5833 9.5833C9.18057 9.98602 9.18057 10.639 9.5833 11.0417L15.0416 16.5L9.5833 21.9583C9.18057 22.361 9.18057 23.014 9.5833 23.4167C9.98602 23.8194 10.639 23.8194 11.0417 23.4167L16.5 17.9584L21.9583 23.4167C22.361 23.8194 23.014 23.8194 23.4167 23.4167C23.8194 23.014 23.8194 22.361 23.4167 21.9583L17.9584 16.5L23.4167 11.0417C23.8194 10.639 23.8194 9.98602 23.4167 9.5833C23.014 9.18057 22.361 9.18057 21.9583 9.5833L16.5 15.0416L11.0417 9.5833Z" fill="#D00000"/>
</g>
<defs>
<clipPath id="clip0_506_984">
<rect width="33" height="33" fill="white"/>
</clipPath>
</defs>
</svg>

function RateRenterButton({postId, initialRated, initialRating, onRated}: {postId: string, initialRated: boolean, initialRating: number, onRated: () => Promise<void>}){
  const [isRating, setIsRating] = useState(false);
  const [value, setValue] = useState(initialRating);
  const [isRenterRated, setIsRenterRated] = useState(initialRated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValueChange = (e:Event, ratingValue:number)=>{
    setValue(ratingValue);
  }
  const handleSubmitRating = async ()=>{
    setLoading(true);
    setError(null);
    const res = await rateSeller(postId, value, isRenterRated);
    setLoading(false);
    if (res.success) {
      setIsRenterRated(true);
      setIsRating(false);
      await onRated();
    } else {
      setError(res.detail ?? 'Failed to rate.');
      // If backend says already rated, switch local state so next submit uses PATCH
      if (res.detail?.includes('already rated')) setIsRenterRated(true);
    }
  };
  const handleCloseRating = ()=>{
    setIsRating(false);
    setError(null);
  }
  return(
    !isRating?
      (!isRenterRated?<div onClick={()=> setIsRating(true)} className={style.rating_button}>Rate the host</div>:
        <div onClick={()=> setIsRating(true)} className={style.rated_button}>{value.toFixed(2)} {STAR_LOGO_SMALL}</div>):
    <div className={style.rating_slider_container}>
    {loading && <div className={style.loading_overlay}/>}
    <button className={style.confirm_rating_button} onClick={handleCloseRating}>{LEAVE_TAB_WHITE}</button>
      <Slider
        className={style.rating_slider}
        onChange={handleValueChange}
        value={value}
        valueLabelDisplay="on"
        aria-label="rating"
        defaultValue={initialRating}
        step={1}
        marks
        min={0}
        max={5}
      />
      {error && <p style={{color:'red', fontSize:'0.75rem', margin:'0 4px'}}>{error}</p>}
      <button className={style.confirm_rating_button} onClick={handleSubmitRating} disabled={loading}>
        {loading ? '…' : CONFIRM}
      </button>
    </div>
  )
}

function RateNookButton({setRatingValue, initialValue = 0}:{setRatingValue:React.Dispatch<React.SetStateAction<number | undefined>>, initialValue?: number}){
  const [isRating, setIsRating] = useState(initialValue === 0);
  const [isNookRated, setIsNookRated] = useState(initialValue > 0);
  const [value, setValue] = useState(initialValue);
  const handleValueChange = (e:Event, rating:number)=>{
    setValue(rating);
  }
  const handleConfirm = ()=>{
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
        defaultValue={initialValue}
        step={1}
        marks
        min={0}
        max={5}
      />
      <button className={style.confirm_rating_button} onClick={handleConfirm}>{CONFIRM}</button>
    </div>
  )
}

const MAX_COMMENT_LENGTH = 500;

function Comment_review({ ratingValue, id, setIsCommenting, setRatingValue, onCommentAdded, existingComment }: {
  ratingValue: number;
  id: string;
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>;
  setRatingValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  onCommentAdded: () => Promise<void>;
  existingComment?: { id: string; comment: string; rating: number };
}) {
  const comment = useRef<HTMLTextAreaElement>(null);
  const [ratingError, setRatingError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [submitError, setSubmitError] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(existingComment?.comment?.length ?? 0);

  const handleCloseSubmit = () => {
    setIsCommenting(false);
  }

  const handleSubmit = async () => {
    if (!ratingValue) {
      setRatingError(true);
      return;
    }
    if (!comment.current?.value.trim()) {
      setCommentError(true);
      return;
    }
    if (comment.current!.value.length > MAX_COMMENT_LENGTH) {
      setSubmitError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }
    setRatingError(false);
    setCommentError(false);
    setSubmitError(false);
    setLoading(true);

    const res = existingComment
      ? await updateComment(id, existingComment.id, comment.current!.value, ratingValue)
      : await addComment(id, comment.current!.value, ratingValue);

    setLoading(false);
    if (res.success) {
      await onCommentAdded();
      setIsCommenting(false);
    } else {
      setSubmitError(res.detail ?? 'Failed to submit. Please try again.');
    }
  }

  const atLimit = charCount >= MAX_COMMENT_LENGTH;

  return (
    <div className={style.nook_review}>
      {loading && <div className={style.loading_overlay}/>}
      <div className={style.nook_rating_and_close_button}>
        <RateNookButton
          initialValue={existingComment?.rating ?? 0}
          setRatingValue={(v) => { setRatingValue(v); setRatingError(false); }}
        />
        <button onClick={handleCloseSubmit} className={style.close_button}>Close</button>
      </div>
      {ratingError && <p style={{color:'red', fontSize:'0.8rem', margin:'0 0 4px'}}>Please select a rating before submitting.</p>}
      {submitError && <p style={{color:'red', fontSize:'0.8rem', margin:'0 0 4px'}}>{submitError}</p>}
      <div className={style.comment_input}>
        <textarea
          ref={comment}
          name="comment"
          id={style.comment}
          placeholder='Write your comment'
          defaultValue={existingComment?.comment ?? ''}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => { setCommentError(false); setCharCount(e.target.value.length); }}
        />
        <div className={style.comment_input_footer}>
          {commentError && <p className={style.comment_input_error}>Please write a comment before submitting.</p>}
          {atLimit && <p className={style.comment_input_error}>Character limit reached</p>}
          <span className={atLimit ? style.char_count_limit : style.char_count}>
            {charCount}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
        <button onClick={handleSubmit} disabled={loading} style={loading ? {opacity:0.5, cursor:'not-allowed'} : {}}>
          {loading ? 'Submitting…' : existingComment ? 'Update' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

function Description({description}:{description:string}){
  return(
      <div className={style.description_container}>
        <div className={style.description_title}>Description</div>
        <p className={style.description}>
          {description}
        </p>
      </div>
  )
}

const ALLOWED_PEOPLE_CATEGORIES: Record<string, { family: boolean; single: boolean; couple: boolean }> = {
  AL: { family: true,  single: true,  couple: true  },
  FA: { family: true,  single: false, couple: false },
  NM: { family: true,  single: false, couple: true  },
  NC: { family: true,  single: true,  couple: false },
  NP: { family: true,  single: true,  couple: true  },
}

function Rules_categories_features({ house_rules, allowed_people, features }: {
  house_rules: { allows_animals: boolean; allows_smoking: boolean; allows_noise: boolean } | null;
  allowed_people: string;
  features: string[];
}) {
  const categories = ALLOWED_PEOPLE_CATEGORIES[allowed_people] ?? ALLOWED_PEOPLE_CATEGORIES.AL;

  return(
    <>
      <div className={style.rules_categories_container}>
          <div className={style.rules_container}>
            <div className={style.rules_container_item}>Rules :</div>
            <div className={style.rules_container_item}>Smoking {house_rules?.allows_smoking ? ALLOW : NOT_ALLOW}</div>
            <div className={style.rules_container_item}>Animals {house_rules?.allows_animals ? ALLOW : NOT_ALLOW}</div>
            <div className={style.rules_container_item}>Noise {house_rules?.allows_noise ? ALLOW : NOT_ALLOW}</div>
          </div>
          <div className={style.categories_container}>
            <div className={style.rules_container_item}>Categories :</div>
            <div className={style.rules_container_item}>Family {categories.family ? ALLOW : NOT_ALLOW}</div>
            <div className={style.rules_container_item}>Single {categories.single ? ALLOW : NOT_ALLOW}</div>
            <div className={style.rules_container_item}>Couple {categories.couple ? ALLOW : NOT_ALLOW}</div>
          </div>
      </div>

      {features.length > 0 && (
        <div className={style.features_container}>
          <div className={style.features_title}>Features</div>
          <div className={style.features}>
            {features.map((f) => {
              const feat = FEATURE_ICONS[f]
              return (
                <div key={f} className={style.feature}>
                  {feat?.icon}
                  <p>{feat?.label ?? f}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}


function Comments_invisible({setShowComments,sectionData,onCommentAdded,comment_list,currentUserId}:{setShowComments:React.Dispatch<React.SetStateAction<boolean>>,sectionData:any,onCommentAdded:()=>Promise<void>,comment_list:import('@/types/api_types').CommentData[],currentUserId:number|null}){
  const [isCommenting, setIsCommenting] = useState(false);
  const existingComment = currentUserId ? comment_list.find(c => c.user_id === currentUserId) : undefined;
  const [ratingValue,setRatingValue] = useState<number>(Number(existingComment?.rating ?? 0));
  const screenWidth = useMediaQuery('(min-width:700px)');
  const mobileFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCommenting && mobileFormRef.current) {
      mobileFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isCommenting]);
  return(
          <div className={style.nook_and_renter_rating}>
            <div className={style.rating_display}>
              <div className={`${style.rating_and_ratingButton_container} ${style.rating_and_ratingButton_container_desktop_view}`}>
                <div onClick={ ()=>setShowComments((prev)=>!prev)} className={style.nook_rating_and_comments}>
                    <div className={style.nook_rating_value}>
                      {sectionData.nook_rating}
                      {STAR_LOGO}
                    </div>
                    <div className={style.comments_number}>
                      {sectionData.comments_num}<br/><span>Comments</span>
                    </div>

                </div>
                
                {currentUserId !== sectionData.id && !isCommenting && (
                  !ratingValue?
                  <div onClick={()=>setIsCommenting(true)} className={style.rating_button}>Rate the nook</div>:
                  <div onClick={()=> setIsCommenting(true)} className={style.rated_button}>{ratingValue.toFixed(2)} {STAR_LOGO_SMALL}</div>
                  )}

              </div>
              {/* this will be a component */}
              <div className={style.rating_and_ratingButton_container}>
                <Link href={`/profile/${sectionData.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={style.renter_rating} style={{ cursor: 'pointer' }}>
                  <div className={style.profile_picture}><Image src={sectionData.profile_picture} width={55} height={55} alt='profile picture'/></div>
                  <div className={style.name_rating_container}>
                    <div className={style.name_container}>
                      Host : {sectionData.full_name}
                    </div>
                    <div className={style.rating_container}>
                      {sectionData.rating}
                      {STAR_LOGO_SMALL}
                    </div>
                  </div>
                </div>
                </Link>
                {currentUserId !== sectionData.id && (screenWidth? <>{!isCommenting && <RateRenterButton postId={sectionData.post_id} initialRated={sectionData.user_rating_seller != null} initialRating={Number(sectionData.user_rating_seller ?? 0)} onRated={onCommentAdded} />}</>:<RateRenterButton postId={sectionData.post_id} initialRated={sectionData.user_rating_seller != null} initialRating={Number(sectionData.user_rating_seller ?? 0)} onRated={onCommentAdded} />)}
              </div>
            </div>
            {isCommenting?
              <div className={style.upper_comment_review_mobile_view}>
                <Comment_review ratingValue={ratingValue} id={sectionData.post_id} setIsCommenting={setIsCommenting} setRatingValue={setRatingValue} onCommentAdded={onCommentAdded} existingComment={existingComment ? {id: existingComment.id, comment: existingComment.comment, rating: Number(existingComment.rating)} : undefined}/>
              </div>:
              <Description description={sectionData.description}/>
              }
            <Rules_categories_features house_rules={sectionData.house_rules} allowed_people={sectionData.allowed_people} features={sectionData.features} />
            <div className={style.rating_and_ratingButton_container_mobile_view}>
              <div className={style.rating_display}>
                <div className={style.rating_and_ratingButton_container}>
                  <div onClick={screenWidth?(()=>{setShowComments((prev)=>!prev)}) : undefined} className={style.nook_rating_and_comments}>
                      <div className={style.nook_rating_value}>
                        {sectionData.nook_rating}
                        {STAR_LOGO}
                      </div>
                      <div className={style.comments_number}>
                        {sectionData.comments_num}<br/><span>Comments</span>
                      </div>

                  </div>
                  {currentUserId !== sectionData.id && !isCommenting && (
                    !ratingValue?
                    <div onClick={()=>setIsCommenting(true)} className={style.rating_button}>Rate the nook</div>:
                    <div onClick={()=> setIsCommenting(true)} className={style.rated_button}>{ratingValue.toFixed(2)} {STAR_LOGO_SMALL}</div>
                    )}

                </div>
              </div>
              {comment_list.length > 0 && (
              <div className={style.mobile_comments_slider}>
                {comment_list.map((com) => (
                  <div key={com.id} className={style.mobile_comments_slider_item}>
                    <Comment comment_data={com} currentUserId={currentUserId} postId={sectionData.post_id} onDeleted={onCommentAdded} />
                  </div>
                ))}
              </div>
            )}
            </div>
            {isCommenting&&
            <div ref={mobileFormRef} className={style.lower_comment_review_mobile_view}>
                <Comment_review ratingValue={ratingValue} id={sectionData.post_id} setIsCommenting={setIsCommenting} setRatingValue={setRatingValue} onCommentAdded={onCommentAdded} existingComment={existingComment ? {id: existingComment.id, comment: existingComment.comment, rating: Number(existingComment.rating)} : undefined}/>
              </div>}
          </div>
  )
}


function Comments_visible({setShowComments,sectionData,currentUserId,onCommentAdded}:{setShowComments:React.Dispatch<React.SetStateAction<boolean>>,sectionData:any,currentUserId:number|null,onCommentAdded:()=>Promise<void>}){
  console.log(sectionData)
  return(
    
          <div className={style.nook_and_renter_rating}>
            <div className={`${style.rating_display} ${style.rating_display_onCommentsShow}`}>
                <div onClick={()=>setShowComments((prev)=>!prev)} className={`${style.nook_rating_and_comments} ${style.nook_rating_and_comments_onCommentsShow}`}>
                    <div className={style.nook_rating_value}>
                      {sectionData.nook_rating}
                      {STAR_LOGO}
                    </div>
                    <div className={style.comments_number}>
                      {sectionData.comments_num}<br/><span>Comments</span>
                    </div>
                </div>
                <div className={style.wrapper}>
                  <div className={style.comments_container}>
                    {sectionData.comment_list.map((com)=><Comment key={com.id} comment_data={com} currentUserId={currentUserId} postId={sectionData.post_id} onDeleted={onCommentAdded}/>)}
                  </div>
                <button className={style.leave_show_comments} onClick={()=>setShowComments(false)}>{LEAVE_TAB}</button>
                </div>
              {/* this will be a component */}
              
            </div>
            
          </div>
  )
}

type MyReservation = { id: number; arrival_date: string; departure_date: string };

function CancelBookingModal({
  reservations,
  onClose,
  onCancel,
  cancellingId,
  cancelError,
}: {
  reservations: MyReservation[];
  onClose: () => void;
  onCancel: (id: number) => Promise<void>;
  cancellingId: number | null;
  cancelError: string | null;
}) {
  return (
    <div className={style.modal_backdrop} onClick={onClose}>
      <div className={style.cancel_modal} onClick={e => e.stopPropagation()}>
        <div className={style.modal_header}>
          <span className={style.modal_title}>Your Bookings</span>
          <button className={style.modal_close_btn} onClick={onClose}>{LEAVE_TAB}</button>
        </div>
        {cancelError && <p className={style.modal_error}>{cancelError}</p>}
        {reservations.length === 0 ? (
          <p className={style.modal_empty}>No bookings to cancel.</p>
        ) : (
          <div className={style.modal_list}>
            {reservations.map(r => (
              <div key={r.id} className={style.modal_reservation_item}>
                <div className={style.modal_dates}>
                  <span>{r.arrival_date}</span>
                  <span className={style.modal_arrow}>→</span>
                  <span>{r.departure_date}</span>
                </div>
                <button
                  className={style.modal_cancel_btn}
                  onClick={() => onCancel(r.id)}
                  disabled={cancellingId !== null}
                >
                  {cancellingId === r.id ? 'Cancelling…' : 'Cancel'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HouseInformationAndBooking({post_data,onCommentAdded,onReservationCreated,currentUserId,initialReservations}:{post_data:any,onCommentAdded:()=>Promise<void>,onReservationCreated:()=>Promise<void>,currentUserId:number|null,initialReservations:MyReservation[]}){
  const [showComments, setShowComments] = useState(false);
  const [visitorsActive, setVisitorsActive] = useState(false);
  const [visitorsNumber, setVisitorsNumber] = useState<string>('0');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [visitorsHint, setVisitorsHint] = useState(false);
  const [myReservations, setMyReservations] = useState<MyReservation[]>(initialReservations);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleVisitorsNumber = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(Number(e.currentTarget.value)<1){
      setVisitorsNumber('0');
      return;
    }
    if(e.currentTarget.value.charAt(0)==='0'){
      const new_visitors =e.currentTarget.value.slice(1);
      setVisitorsNumber(new_visitors);
      return;
    }
    setVisitorsNumber(e.currentTarget.value);
  }


  const handleBook = async () => {
    if (!bookedDates) {
      setBookingError('Please select arrival and departure dates before booking.');
      return;
    }
    if (Number(visitorsNumber) < 1) {
      setVisitorsHint(true);
      return;
    }
    setVisitorsHint(false);
    setBookingError(null);
    setBookingSuccess(false);
    setBookingLoading(true);
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const res = await createReservation(post_data.id, fmt(bookedDates.start), fmt(bookedDates.end));
    setBookingLoading(false);
    if (res.success) {
      setBookingSuccess(true);
      setMyReservations(prev => [...prev, res.reservation]);
      await onReservationCreated();
    } else {
      setBookingError(res.error ?? 'Reservation failed. Please try again.');
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    setCancellingId(reservationId);
    setCancelError(null);
    const res = await cancelReservation(reservationId, post_data.id);
    setCancellingId(null);
    if (res.success) {
      setMyReservations(prev => {
        const updated = prev.filter(r => r.id !== reservationId);
        if (updated.length === 0) setShowCancelModal(false);
        return updated;
      });
      await onReservationCreated();
    } else {
      setCancelError(res.error ?? 'Failed to cancel reservation.');
    }
  };

  //some conditions for readability
  const visitors_value = Number(visitorsNumber)>0?visitorsNumber:<>Visitors</>
  const visitors_style = Number(visitorsNumber)>0? style.visitors_after:style.visitors_before;
  return(
    <section className={style.nook_data_and_scheduler}>
        <div className={style.nook_data}>

          {!showComments?
            <Comments_invisible sectionData={{...post_data.seller,post_id:post_data.id,description:post_data.description,nook_rating: post_data.rating,comments_num:post_data.comments_count,features:post_data.features??[],house_rules:post_data.house_rules??null,allowed_people:post_data.allowed_people??'AL',user_rating_seller:post_data.user_rating_seller??null}} setShowComments={setShowComments} onCommentAdded={onCommentAdded} comment_list={post_data.comment_list??[]} currentUserId={currentUserId}/>:
            <Comments_visible sectionData={{...post_data.seller,post_id:post_data.id,comment_list:post_data.comment_list,nook_rating:post_data.rating,comments_num:post_data.comments_count}} setShowComments={setShowComments} currentUserId={currentUserId} onCommentAdded={onCommentAdded}/>
          }
        </div>

        {currentUserId !== post_data.seller.id && (
        <div className={style.nook_scheduler}>
          <div className={style.nook_scheduler_container}>
            <MyDatePicker setCalendarOpen={setCalendarOpen} calendarOpen={calendarOpen} reservations={post_data.reservations ?? []} onConfirm={(start, end) => { setBookedDates({ start, end }); setBookingError(null); }}/>
            {!calendarOpen &&
            <>
              <div className={style.visitors_and_price}>
                <div className={style.price_container}><span>{post_data.house.Price} DA</span> <span id={style.perNight}>per night</span></div>
                {visitorsActive?<input autoFocus onBlur={()=>setVisitorsActive(false)} value={visitorsNumber} onChange={handleVisitorsNumber} type="number" />:<div onClick={()=>{ setVisitorsActive(true); setVisitorsHint(false); }} className={`${style.visitors} ${visitors_style}`}>{visitors_value}</div>}
              </div>
              {visitorsHint && <p style={{color:'orange', fontSize:'0.8rem', margin:'0'}}>Please enter the number of visitors.</p>}
              {bookingError && <p style={{color:'red', fontSize:'0.8rem', margin:'0'}}>{bookingError}</p>}
              {bookingSuccess && <p style={{color:'green', fontSize:'0.8rem', margin:'0'}}>Reservation confirmed!</p>}
              <div className={style.booking_buttons_row}>
                <button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  style={bookingLoading ? {opacity:0.5, cursor:'not-allowed'} : {}}
                >
                  {bookingLoading ? 'Booking...' : 'Book'}
                </button>
                {myReservations.length > 0 && (
                  <button
                    className={style.cancel_booking_btn}
                    onClick={() => { setShowCancelModal(true); setCancelError(null); }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </>}
          </div>
        </div>
        )}
        {showCancelModal && (
          <CancelBookingModal
            reservations={myReservations}
            onClose={() => { setShowCancelModal(false); setCancelError(null); }}
            onCancel={handleCancelReservation}
            cancellingId={cancellingId}
            cancelError={cancelError}
          />
        )}
      </section>
  )
}