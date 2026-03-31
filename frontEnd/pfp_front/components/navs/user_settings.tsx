'use client'

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import style from '@/styles/nav_bar_styles/nav_bar.module.css'
import { wilayas } from "@/data/auth_data/data";
const CHANGE_PFP = (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25005 16.2501C1.25 16.1855 1.25 16.1189 1.25 16.0502V4.4502C1.25 3.33009 1.25 2.76962 1.46799 2.3418C1.65973 1.96547 1.96547 1.65973 2.3418 1.46799C2.76962 1.25 3.33009 1.25 4.4502 1.25H16.0502C17.1703 1.25 17.7301 1.25 18.1579 1.46799C18.5342 1.65973 18.8405 1.96547 19.0322 2.3418C19.25 2.7692 19.25 3.32899 19.25 4.44691V16.0531C19.25 16.5381 19.25 16.9179 19.2322 17.2274M1.25005 16.2501C1.25082 17.2384 1.26337 17.7558 1.46799 18.1574C1.65973 18.5337 1.96547 18.8405 2.3418 19.0322C2.7692 19.25 3.32899 19.25 4.44691 19.25H16.0536C17.1715 19.25 17.7305 19.25 18.1579 19.0322C18.5342 18.8405 18.8405 18.5337 19.0322 18.1574C19.1555 17.9154 19.209 17.6313 19.2322 17.2274M1.25005 16.2501L6.01798 10.6875L6.01939 10.686C6.44227 10.1926 6.65406 9.94551 6.90527 9.85645C7.12594 9.77821 7.36686 9.78004 7.58643 9.86133C7.83664 9.95397 8.04506 10.2039 8.46191 10.7041L11.1331 13.9095C11.519 14.3726 11.713 14.6054 11.9486 14.6989C12.1565 14.7813 12.3857 14.7906 12.6001 14.7273C12.8442 14.6553 13.0591 14.4404 13.4888 14.0107L13.9858 13.5137C14.4233 13.0762 14.6421 12.8576 14.8897 12.7861C15.1071 12.7234 15.3396 12.7369 15.5488 12.8232C15.787 12.9216 15.9802 13.1624 16.3667 13.6455L19.2322 17.2274M19.2322 17.2274L19.25 17.2496M13.25 7.25C12.6977 7.25 12.25 6.80228 12.25 6.25C12.25 5.69772 12.6977 5.25 13.25 5.25C13.8023 5.25 14.25 5.69772 14.25 6.25C14.25 6.80228 13.8023 7.25 13.25 7.25Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

const password_settings = {
  required:"Password is required",
  minLength:{
    value:8,
    message:"Password must be at least 8 characters"},
  pattern:{
    value:/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    message: "at least one special and upper-case character"
  },
}

function ResetPassword({setIsChangingPassword}:{setIsChangingPassword:React.Dispatch<React.SetStateAction<boolean>>}){
  const {register,handleSubmit,setError,formState:{errors}} = useForm();
  const handleNewPasswordSubmit = (data:object)=>{
    if(data.new_password !== data.repeat_new_password){
      console.log(data)
      setError('new_password',{
              type:'manual',
              message:'they not the same brotha',
            });
    }
  }
  return(
    <form className={style.user_settings_form} onSubmit={handleSubmit((data)=>{
          handleNewPasswordSubmit(data);
        })}>
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="text" autoComplete="new-password" {...register("old_password",{required:true})} placeholder="Enter old Password" />
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="password" {...register("new_password",password_settings)} placeholder="Enter new password" />
      <input type="password" {...register("repeat_new_password",{required:true})} placeholder="Repeat new password" />
      {errors.new_password?.message&&<p className={style.error_message}>{errors.new_password?.message}</p>}
      <div className={style.buttons_container}>
        <input onClick={()=>setIsChangingPassword((prev)=>!prev)} type="button" value={'Back'}/>
        <input type="submit" value={'Save'}/>
      </div>
    </form>
  )
}

function ChangeInformation({setIsChangingInformation}:{setIsChangingInformation:React.Dispatch<React.SetStateAction<boolean>>}){
  const {register,handleSubmit,setError,formState:{errors}} = useForm();
  const handleNewPasswordSubmit = (data:object)=>{
    console.log(data)
    
  }

  return(
    <form className={style.user_settings_form} onSubmit={handleSubmit((data)=>{
          handleNewPasswordSubmit(data);
        })}>
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="text" {...register("new_full_name",{required:true})} placeholder="Enter new Full name" />
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="date" {...register("new_birth_date",{required:true})} />
      <select {...register("location",{required:true})} >
        {wilayas.map((wilaya)=> <option key={wilaya.code} value={wilaya.name}>{wilaya.name}</option>)}
      </select>
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="text" {...register("new_phone",{required:true})} placeholder="Enter new Phone number" />
      <input readOnly onFocus={(e) => e.target.removeAttribute('readonly')} type="text" {...register("new_email",{required:true})} placeholder="Enter new Email" />
      <div className={style.buttons_container}>
        <input onClick={()=>setIsChangingInformation((prev)=>!prev)} type="button" value={'Back'}/>
        <input type="submit" value={'Save'}/>
      </div>
        
    </form>
  )
}


export default function UserSettings({setSettingsOpen}:{setSettingsOpen:React.Dispatch<React.SetStateAction<boolean>>}){
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [IsChangingInformation, setIsChangingInformation] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const handleClick = (e:MouseEvent)=>{
      console.log(e.target)
      console.log(tabRef.current)
      if(tabRef && !tabRef.current?.contains(e.target as Node)){
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown',handleClick)

    return ()=> document.removeEventListener('mousedown',handleClick);
  },[])

  return(
    <div ref={tabRef} className={style.user_settings}>
      <div className={style.container}>
        <div className={style.user_email}>ba.tetbirt@ensta.edu.dz</div>
        {(isChangingPassword&&<ResetPassword setIsChangingPassword={setIsChangingPassword}/>) || (IsChangingInformation && <ChangeInformation setIsChangingInformation={setIsChangingInformation}/>)||
        <>
        <div className={style.user_pfp}></div>
        <div className={style.user_change_pfp_icon}>{CHANGE_PFP}</div>
        <div className={style.hi_user}>Hi Abdellah</div>
        <div className={style.user_settings_button}>Get your license</div>
        <div onClick={()=>setIsChangingPassword(true)} className={style.user_settings_button}>Change your password</div>
        <div onClick={()=>setIsChangingInformation(true)} className={style.user_settings_button}>Change your information</div> 
        </>
        }
      </div>
      <svg onClick={()=>setSettingsOpen(false)} viewBox="0 0 24 24" width={24} height={24}>
        <line x1="7" y1="7" x2="17" y2="17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
        />
        <line x1="17" y1="7" x2="7" y2="17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
        />
      </svg>
    </div>
  )
}