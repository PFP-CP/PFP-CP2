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
type keyValues = "email" | "full_name" | "password";

export const errMap= new Map([
  ["Email: Must be of the form some@thing.ext",1],
  ["Password: Must be at least 8 characters",2],
  ["Password: Must contain uppercase letter",3],
  ["Password: Must contain number",4],
  ["Password: Must contain special character",5],
  ["Full name: Only spaces,dashes and ' are allowed.",6]
]);

export type FormType = {
  full_name: string;
  email: string;
  password: string;
  gender: string;
  location: string;
  birth_date: string;
}

const handle_auth_submit =(e:React.SubmitEvent<HTMLFormElement>,type:string, form:FormType)=>{
      e.preventDefault()
      switch (type) {
        case "login":
          fetch('https://webhook.site/6bbaee91-6155-4cee-ad3c-ae865ee85dd3',{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({email:form.email,password:form.password}),
          mode:'no-cors'
      })
          break;
        case "forget":
          fetch('https://webhook.site/6bbaee91-6155-4cee-ad3c-ae865ee85dd3',{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({email:form.email}),
          mode:'no-cors'
      })
        break;
        
        case "signup":
          fetch('https://webhook.site/76f931ac-e4f6-4db8-8a14-3546402f9a8d',{
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


    const handleDatePicker = (date:Date|null, form:FormType,setForm:React.Dispatch<React.SetStateAction<FormType>>,setDate:React.Dispatch<React.SetStateAction<Date|null>>)=>{
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
  
  const ref = useRef<HTMLDivElement>(null);
const prevRect = useRef<DOMRect | null>(null);

   const getRect= ()=>{
     prevRect.current=ref.current?.getBoundingClientRect() || null;
   }

  // useLayoutEffect(()=>{
  //   let new_pos = ref.current.getBoundingClientRect();
  //   if(!new_pos) return;
    
  //   let dy = prevRect.current?.top- new_pos.top ;

  //   ref.current.style.transition = `transform 0s`
  //   ref.current.style.transform = `translate(0,${dy}px)`;

  //   ref.current.getBoundingClientRect();


  //   requestAnimationFrame(()=>{
  //     ref.current.style.transition = `transform 300ms`;
  //     ref.current.style.transform = `translate(0,0)`;
  //   })

  //   prevRect.current = new_pos;

  // })

  const errorList:string[]=[];
  Object.keys(errors).map((key)=>{
    if(errors[key as keyValues]!=="") errorList.push(errors[key as keyValues]) 
  })

  const resetFields=()=>{
    setForm({full_name:"",email:"",password:"",gender:"",location:"",birth_date:""});
    setIsValid(true)
  }
  

   const handleSubmition= (e:React.SubmitEvent<HTMLFormElement>)=>{
    if(isLogin && !isForget){
      handle_auth_submit(e,"login",form)
    }else if(isLogin && isForget){
      handle_auth_submit(e,"forget",form)
    }else if(!isLogin){
      handle_auth_submit(e,"signup",form)

    }
   } 

  return(

    
    <div key={isLogin? 1:2} className={styles.auth_container}>
      <div className={styles2.auth_img_container}>
            <Image src="/logo/logo.svg" alt="logo_picture" fill style={{objectFit:'cover'}}/>
    </div>
      {/* if at login show this */}

    <form onSubmit={(e)=>handleSubmition(e)} className={styles2.auth_form}>
        {isLogin?<>
        <div className={!isForget?styles2.input_container:styles2.input_container_forgot}>
        <FormInput isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="email" name="email" placeHolder="Enter address" required={true}></FormInput>
          <div className={!isForget ? styles2.pass_container:styles2.pass_container_forgot}>
            {!isForget ?<>
              <FormInput   isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Password" required={true}></FormInput>
              <button type="button" onClick={()=>{setIsForget(!isForget);resetFields()}} className={`${styles2.btn_anchor} ${styles2.forgot_pass}`} >Forgot password</button>
             </>:
             <p>Please enter the email address you'd like your<br/>
                password reset information sent to
             </p>
             }
          </div>
        </div>
        <div className={styles2.sign_in_btn_container}>
          <FormButton btnType="submit" btnContent={isForget?"Request reset link":"Sign up"}></FormButton>
          {!isForget?
          <div className={styles2.have_an_account}>
            <h1>Have you an account?</h1>
            <button className={`${styles2.btn_anchor} ${styles2.back_to_sign_in}`} onClick={()=> {getRect();setIsLogin(false);resetFields();}}>Sign up</button>
          </div>:
          <button  className={`${styles2.btn_anchor} ${styles2.back_to_sign_in}`} onClick={()=> {getRect();setIsLogin(true);setIsForget(false);resetFields();}}>Back to sign in</button>
          }
        </div>
        </>:
        <>
    {/* if at signup show this */}
      
        
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="full_name" placeHolder="Full Name" ></FormInput>
        <DatePicker
         preventOpenOnFocus={false}
         placeholderText="Date of birth" 
         selected={handledate} 
         onChange={(date:Date|null)=>handleDatePicker(date,form,setForm,setDate)}/>
      
      <FormInput setErrors={setErrors} errors={errors} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="location" placeHolder="Location" ></FormInput>   
      <RadioButton setValue={setForm} value={form} ></RadioButton>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="email" name="email" placeHolder="Enter address" ></FormInput>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Enter password" ></FormInput>
      {!isValid&&<div className={styles2.error_popup}>
        <ul>
          {errorList.map((err)=>{
            return <li key={errMap.get(err)}>- {err}</li>
          })}
        </ul>
        </div>}
  
      <div className={styles2.sign_up_btn_container}>
        <FormButton btnType="submit" btnContent="Sign up"></FormButton>
        <button  className={`${styles2.btn_anchor} ${styles2.back_to_sign_in}`} onClick={()=>{getRect();setIsLogin(true);resetFields();}}>Back to sign in</button>
      </div>
      </>}
    </form>

    </div>
  )
}