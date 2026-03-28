'use client'
import style from "@/styles/auth_styles/auth_styles.module.css"
import { FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { login } from "@/app/(authentication)/actions/login";
import { signup } from "@/app/(authentication)/actions/signup"
import { useSearchParams, useRouter } from "next/navigation";
import { forget,newPass } from "@/app/(authentication)/actions/forget";
import { wilayas } from "@/data/auth_data/data";
 
//animation function
const email_settings = {required:"Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Entered value does not match email format",
          }
        }
const phone_settings = {required:"Phone number is required",
  pattern: {
            value: /^(0)(5|6|7)[0-9]{8}$/,
            message: "Entered value does not match algerian phone format",
          }
        }
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
const logo = <svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="60" font-family="sansation-700" font-weight="bold" font-size="72" fill="#2E1B7B">Nook</text>
</svg>

function login_form(register:UseFormRegister<FieldValues>, setAuthState:React.Dispatch<React.SetStateAction<string>>, errors:FieldErrors<FieldValues>){
  
  return(
    <>
      <div className={style.form_fields_container}>
          <input className={errors.Email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" />
          <p className={style.error_message}>{errors.email?.message}</p>
          <div className={style.password_container}>
            <input type="password" {...register("password",{required:'Enter a password man'})} placeholder="Password" />
            <p className={style.error_message}>{errors.password?.message}</p>
            <button type="button" onClick={()=>setAuthState("forget_password")} className={style.forgot_password}>Forget password?</button>
          </div>
      </div>
        
    </>
  )
}

function signup_form(register:UseFormRegister<FieldValues>,errors:FieldErrors<FieldValues>){
  
  return(
    <>
      <div className={style.form_fields_container}>
          <input type="text" {...register("full_name",{required:true,})} placeholder="Full name" />
          <input type="date" {...register("date",{required:true})} placeholder="Date of birth" />
          <select {...register("location",{required:true})} >
            {wilayas.map((wilaya)=> <option key={wilaya.code} value={wilaya.name}>{wilaya.name}</option>)}
          </select>
          <input {...register("gender",{required:true})} placeholder="gender" />
          
          <input className={errors.phone&&style.input_invalid} {...register("phone",phone_settings)} placeholder="Phone number" />
          {errors.phone?.message&&<p className={style.error_message}>{errors.phone?.message}</p>}

          <input type="password" {...register("password",password_settings)} placeholder="Password" />
            {errors.password?.message&&<p className={style.error_message}>{errors.password?.message}</p>}
          
          <input className={errors.email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" />
          {errors.email?.message&&<p className={style.error_message}>{errors.email?.message}</p>}
          <input type="password" {...register("password",{required:true})} placeholder="password" />
          {errors.Password?.message&&<p className={style.error_message}>{errors.password?.message}</p>}
      </div>
    </>
  )
}

function forgot_password(register:UseFormRegister<FieldValues>, errors:FieldErrors<FieldValues>){
  return(
    <>
      <div className={style.form_fields_container}>
          <input className={errors.Email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" />
          <p className={style.error_message}>{errors.email?.message}</p>
          <p id={style.forget_pass_p}>Please enter the email address you’d like your password reset information sent to</p>
      </div>
    </>
  )
}

function forgot_password_code(register:UseFormRegister<FieldValues>){

  return(
    <>
      <div className={style.form_fields_container}>
        <input type="text" {...register("new_password",password_settings)} placeholder="New Password" />
        <input {...register("key",{required:true})} placeholder="Key" />
      </div>
    </>
  )
}

export default function AuthForm() {
  const {register, handleSubmit,setError,reset, watch,formState:{errors}} = useForm();
  const [authState, setAuthState] = useState('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/home';
  const handleAuthSwitch= ()=>{
    if(authState==="login") {
      setAuthState("signup");
      reset();
      return;
    }
    setAuthState("login");
    reset();
  }


  const handle_auth_submit =async (type:string, form:object)=>{
      let res;
      console.log(type);
        switch (type) {
          case "login":
            res = await login(form.email,form.password);
            if(res.success){
              router.push(redirectTo);
            }else{
              setError('password',{
              type:'manual',
              message:'Wrong password or email',
            });
            }
            
            break;
          case "forget_password":
            res = await forget(form.email);
            if(res.success){
              setAuthState('forget_password_code');
            }
          break;

          case "forget_password_code":
            res= await newPass('a@g.com', form.password, form.key);
            if(res) setAuthState('login');
          break
          case "signup":
            res = await signup(form.gender,form.location,'GUEST',form.phone,form.full_name,form.email,form.password,form.date);    
          break;
         
          default:
            break;
        }
      
    }


  return (
    <div className={style.auth_page_container}>
      <div className={`${style.form_and_logo_container} ${authState!=="signup"&&style.form_and_logo_container_login}`}>
        <div className={style.logo_container}></div>
        <form className={style.form_container} onSubmit={handleSubmit((data)=>{
          handle_auth_submit(authState,data);
        })}>

          {authState==="login"&&login_form(register,setAuthState, errors)}
          {authState==="signup"&&signup_form(register, errors)}
          {authState==="forget_password"&&forgot_password(register,errors)}
          {authState==="forget_password_code"&&forgot_password_code(register)}

        <AnimatePresence>
          <div  className={ `${authState==="login"&&style.submit_signBtn_container_login} ${style.submit_signBtn_container} ${(authState!=="login")&&style.submit_signBtn_container_signup}`}>  
            <input type="submit" value={(authState==="login"&&"Sign in") || (authState==="signup"&&"Sign Up")|| (authState==="forget_password"&&"Request reset link") || (authState==="forget_password_code"&&"Submit Code") as string}/>
            <div className={style.signBTN_container}>
              {authState==="login"&&<div>Have you an account?</div>}
              <button type="button" onClick={handleAuthSwitch}>{authState==="login"?<>sign up</>:<>back to sign in</>}</button>
            </div>
          </div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
