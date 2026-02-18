'use client'
import FormButton  from "@/components/ui/form_button"
import FormInput from "@/components/ui/form_input"
import styles from "@/styles/structure_css/auth_form.module.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image'
import { FormType } from "./auth_form";
import {useState} from "react"
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

export default function SignUp_auth({setIsLogin}:{setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}){
  const [form,setForm] = useState<FormType>({full_name:"",email:"",password:"",gender:"",location:"",birth_date:""})
  const [handledate, setDate] = useState<Date|null>(null);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({full_name:"",email:"", password:""})

  const handleDatePicker = (date:Date|null)=>{
    let date_to_string = date?.toISOString().split("T")[0];
    if(!date_to_string) date_to_string="";
    setForm({...form, birth_date:date_to_string})
    setDate(date)
  }

  const handleLogin_submit =(e:React.SubmitEvent<HTMLFormElement>)=>{
      e.preventDefault()
      fetch('https://webhook.site/76f931ac-e4f6-4db8-8a14-3546402f9a8d',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        mode:'no-cors'
      })
    }


    let errorList:string[]=[];
    Object.keys(errors).map((key, keyIndex)=>{
            if(errors[key as keyValues]!=="") errorList.push(errors[key as keyValues]) 
          })

  return(
    <>
    <div className={styles.auth_img_container}>
      
            <Image src="/logo/logo.svg" alt="logo_picture" fill style={{objectFit:'cover'}}/>
      </div>
      <form onSubmit={handleLogin_submit} className={styles.auth_form}>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="full_name" placeHolder="Full Name" ></FormInput>
        <DatePicker
         preventOpenOnFocus={false}
         placeholderText="Date of birth" 
         selected={handledate} 
         onChange={(date:Date|null)=>handleDatePicker(date)}/>
      
      <FormInput setErrors={setErrors} errors={errors} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="text" name="location" placeHolder="Location" ></FormInput>   
      <RadioButton setValue={setForm} value={form} ></RadioButton>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="email" name="email" placeHolder="Enter address" ></FormInput>
      <FormInput setErrors={setErrors} errors={errors} test={true} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Enter password" ></FormInput>
      {!isValid&&<div className={styles.error_popup}>
        <ul>
          {errorList.map((err)=>{
            return <li key={errMap.get(err)}>- {err}</li>
          })}
        </ul>
        </div>}
  
      <div className={styles.sign_up_btn_container}>
        <FormButton btnType="submit" btnContent="Sign up"></FormButton>
        <button  className={`${styles.btn_anchor} ${styles.back_to_sign_in}`} onClick={()=>setIsLogin(true)}>Back to sign in</button>
      </div>
    </form>
    </>
    
)
}