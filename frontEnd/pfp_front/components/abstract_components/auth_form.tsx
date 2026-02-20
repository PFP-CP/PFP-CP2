"use client"
import React, {useState , useRef, useLayoutEffect, ChangeEvent} from "react"
import styles from "@/styles/layout_css/auth_layout.module.css"

import FormButton  from "@/components/ui/form_button"
import FormInput from "@/components/ui/form_input"
import styles2 from "@/styles/structure_css/auth_form.module.css"
import Image from 'next/image'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RadioButton from "../ui/radio_input";
import {keyValues, setForm, setDate, animate, FormType} from "@/types/types"


export const errMap= new Map([
  ["Email: Must be of the form some@thing.ext",1],
  ["Password: Must be at least 8 characters",2],
  ["Password: Must contain uppercase letter",3],
  ["Password: Must contain number",4],
  ["Password: Must contain special character",5],
  ["Full name: Only spaces,dashes and ' are allowed.",6]
]);




const handle_auth_submit =(type:string, form:FormType)=>{
      
        switch (type) {
          case "login":
            fetch('https://webhook.site/837ffb73-9b65-418d-8664-51417e8f843d',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email:form.email,password:form.password}),
            mode:'no-cors'
        })
            break;
          case "forget":
            fetch('https://webhook.site/837ffb73-9b65-418d-8664-51417e8f843d',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email:form.email}),
            mode:'no-cors'
        })
          break;

          case "signup":
            fetch('https://webhook.site/837ffb73-9b65-418d-8664-51417e8f843d',{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          mode:'no-cors'
           })
          break
         
          default:
            break;
        }
      
    }


    const handleDatePicker = (date:Date|null, form:FormType,setForm:setForm,setDate:setDate)=>{
    let date_to_string = date?.toISOString().split("T")[0];
    if(!date_to_string) date_to_string="";
    setForm({...form, birth_date:date_to_string})
    setDate(date)
  }


export default function AuthForm(){
  const [isLogin, setIsLogin] = useState(true);
  const [form,setForm] = useState<FormType>({full_name:"",email:"",password:"",gender:"",location:"",birth_date:""})
  const [isForget, setIsForget] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({full_name:"",email:"", password:""})
  const [handledate, setDate] = useState<Date|null>(null);
  
  

  const button_ref = useRef<HTMLDivElement>(null);
  const inpt_ref = useRef<HTMLDivElement>(null);
  const logo_ref = useRef<HTMLDivElement>(null);

  const prevRect_btn = useRef<DOMRect | null>(null);
  const prevRect_inpt = useRef<DOMRect | null>(null);
  const prevRect_logo = useRef<DOMRect | null>(null);

   const getRect= ()=>{
    prevRect_btn.current=button_ref.current?.getBoundingClientRect() || null;
    prevRect_inpt.current=inpt_ref.current?.getBoundingClientRect() || null;
    prevRect_logo.current=logo_ref.current?.getBoundingClientRect() || null;

   }

  useLayoutEffect(()=>{
    let new_pos_button = button_ref.current?.getBoundingClientRect();
    let new_pos_inpt = inpt_ref.current?.getBoundingClientRect();
    let new_pos_logo = logo_ref.current?.getBoundingClientRect();

    if(!new_pos_button) return;
    if(!new_pos_inpt) return;
    if(!new_pos_logo) return;
    
    let dy = prevRect_btn.current?.top- new_pos_button.top ;
    let dy1 = prevRect_inpt.current?.top- new_pos_inpt.top ;
    let dy2 = prevRect_logo.current?.top - new_pos_logo.top;

    button_ref.current.style.transition = `transform 0s`
    button_ref.current.style.transform = `translate(0,${dy}px)`;

    inpt_ref.current.style.transition = `transform 0s`
    inpt_ref.current.style.transform = `translate(0,${dy1}px)`;

    logo_ref.current.style.transition = `transform 0s`
    logo_ref.current.style.transform = `translate(0,${dy2}px)`;

    button_ref.current.getBoundingClientRect();


    requestAnimationFrame(()=>{
      button_ref.current.style.transition = `transform 600ms`;
      button_ref.current.style.transform = `translate(0,0)`;

      inpt_ref.current.style.transition = `transform 600ms`;
      inpt_ref.current.style.transform = `translate(0,0)`;

      logo_ref.current.style.transition = `transform 600ms`
      logo_ref.current.style.transform = `translate(0,0)`;
    })

    prevRect_btn.current = new_pos_button;
    prevRect_inpt.current = new_pos_inpt;


  },[isLogin])

  const errorList:string[]=[];
  Object.keys(errors).map((key)=>{
    if(errors[key as keyValues]!=="") errorList.push(errors[key as keyValues]) 
  })

  const resetFields=()=>{
    setForm({full_name:"",email:"",password:"",gender:"",location:"",birth_date:""});
    setDate(null);
    setErrors({full_name:"",email:"",password:""});
    setIsValid(true);
  }
  

   const handleSubmition= (e:React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!isValid) return;
    if(isLogin && !isForget){
      handle_auth_submit("login",form)
    }else if(isLogin && isForget){
      handle_auth_submit("forget",form)
    }else if(!isLogin){
      handle_auth_submit("signup",form)

    }
    
   } 

   const handleSubmitButton=()=>{
    if(isLogin && !isForget){
      return "Sign in";
    }else if(isLogin && isForget){
      return "Request reset link";
    }else if(!isLogin){
      return "Sign up";

    }
   }

   const handleAuthNavigation = ()=>{
    if(isLogin && !isForget){
      return <div className={styles2.have_an_account}>
        <h1>Have you an account?</h1>
        <button className={`${styles2.btn_anchor} ${styles2.back_to_sign_in}`} onClick={()=> {getRect();setIsLogin(false);resetFields();}}>Sign up</button>
      </div>
    }else{
      return <button  className={`${styles2.btn_anchor} ${styles2.back_to_sign_in}`} onClick={()=> {getRect();setIsLogin(true);setIsForget(false);resetFields();}}>Back to sign in</button>
    }
   }

   const handleForgetDisplay= ()=>{
    if(isForget && isLogin){
      return <p>Please enter the email address you'd like your<br/>
                password reset information sent to
             </p>
    }else if(!isForget && isLogin){
      return <> <FormInput isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Password" required={true}></FormInput>
              <button type="button" onClick={()=>{getRect();setIsForget(!isForget);resetFields()}} className={`${styles2.btn_anchor} ${styles2.forgot_pass}`} >Forgot password</button></>
    }
    return <FormInput errors={errors} setErrors={setErrors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Password" required={true}></FormInput>
   }




  return(
    <div key={isLogin? 1:2} className={styles.auth_container}>
      <div ref={logo_ref} className={styles2.auth_img_container}>
            <Image src="/logo/logo.svg" alt="logo_picture" fill style={{objectFit:'cover'}}/>
    </div>

    <form onSubmit={(e)=>handleSubmition(e)} className={styles2.auth_form}>
        {!isLogin&&
        <div className={styles2.fade_in} style={{
          display:"inherit",
          flexDirection:"inherit",
          gap:"inherit",
        }}>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="full_name" placeHolder="Full Name" ></FormInput>
        <DatePicker
         preventOpenOnFocus={false}
         placeholderText="Date of birth" 
         selected={handledate} 
         onChange={(date:Date|null)=>handleDatePicker(date,form,setForm,setDate)}/>
      
      <FormInput setErrors={setErrors} errors={errors} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="location" placeHolder="Location" ></FormInput>   
      <RadioButton setValue={setForm} value={form} ></RadioButton>
      </div>}
      <div ref={inpt_ref}>
      <div  className={!isForget?styles2.input_container:styles2.input_container_forgot}>
        <FormInput errors={errors} setErrors={setErrors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="email" name="email" placeHolder="Enter address" required={true}></FormInput>
          <div  className={!isForget ? styles2.pass_container:styles2.pass_container_forgot}>
            {handleForgetDisplay()}
          </div>
      </div>
      </div>
      {!isValid && !isLogin &&<div className={styles2.error_popup}>
        <ul>
          {errorList.map((err)=>{
            return <li key={errMap.get(err)}>- {err}</li>
          })}
        </ul>
        </div>}
        <div ref={button_ref} className={styles2.sign_in_btn_container}>
          <FormButton  btnType="submit" btnContent={handleSubmitButton() || ""}></FormButton>
          {handleAuthNavigation()}
        </div>
    </form>

    </div>
  )
}