'use client'
import style from "@/styles/auth_styles/auth_styles.module.css"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { login } from "@/app/(authentication)/actions/login";
import { signup } from "@/app/(authentication)/actions/signup"
import { useSearchParams, useRouter } from "next/navigation";
import { forget,newPass } from "@/app/(authentication)/actions/forget";
import { wilayas } from "@/data/auth_data/data";
import Image from "next/image";
import RadioButton from "@/components/auth_components/ui/radio_input";



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

interface AuthFormData {
  email?: string;
  password?: string;
  full_name?: string;
  date?: string;
  location?: string;
  gender?: string;
  phone?: string;
  new_password?: string;
  key?: string;
}

const EyeIcon = ({ visible, error }: { visible: boolean; error: boolean }) => {
  const stroke = error ? "red" : "#220E67";
  return visible
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
}

function login_form(register:UseFormRegister<AuthFormData>, setAuthState:React.Dispatch<React.SetStateAction<string>>, errors:FieldErrors<AuthFormData>, showPassword:boolean, setShowPassword:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <>
      <div className={style.form_fields_container}>
          <input className={errors.email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" aria-label="Email address" />
          <p className={style.error_message} aria-live="polite">{errors.email?.message as string}</p>
          <div className={style.password_container}>
            <div className={style.password_input_wrapper}>
              <input type={showPassword?"text":"password"} className={`${style.password_input} ${errors.password?style.input_invalid:""}`} {...register("password",{required:'Enter a password man'})} placeholder="Password" aria-label="Password" />
              <button type="button" className={style.eye_btn} onClick={()=>setShowPassword(p=>!p)} aria-label={showPassword?"Hide password":"Show password"}>
                <EyeIcon visible={showPassword} error={!!errors.password} />
              </button>
            </div>
            <p className={style.error_message} aria-live="polite">{errors.password?.message as string}</p>
            <button type="button" onClick={()=>setAuthState("forget_password")} className={style.forgot_password}>Forget password?</button>
          </div>
      </div>
    </>
  )
}

function signup_form(register:UseFormRegister<AuthFormData>,errors:FieldErrors<AuthFormData>, showPassword:boolean, setShowPassword:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <>
      <div className={style.form_fields_container}>
          <input type="text" {...register("full_name",{required:true,})} placeholder="Full name" />
          <input type="date" {...register("date",{required:true})} placeholder="Date of birth" />
          <select {...register("location",{required:true})} >
            {wilayas.map((wilaya)=> <option key={wilaya.code} value={wilaya.name}>{wilaya.name}</option>)}
          </select>
          <RadioButton register={register} />
          <input className={errors.phone&&style.input_invalid} {...register("phone",phone_settings)} placeholder="Phone number" />
          {errors.phone?.message&&<p className={style.error_message}>{errors.phone?.message}</p>}
          <input className={errors.email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" />
          {errors.email?.message&&<p className={style.error_message}>{errors.email?.message}</p>}
          <div className={style.password_input_wrapper}>
            <input type={showPassword?"text":"password"} className={`${style.password_input} ${errors.password?style.input_invalid:""}`} {...register("password",password_settings)} placeholder="Password" />
            <button type="button" className={style.eye_btn} onClick={()=>setShowPassword(p=>!p)} aria-label={showPassword?"Hide password":"Show password"}>
              <EyeIcon visible={showPassword} error={!!errors.password} />
            </button>
          </div>
          {errors.password?.message&&<p className={style.error_message}>{errors.password?.message}</p>}
      </div>
    </>
  )
}

function forgot_password_form(register:UseFormRegister<AuthFormData>, errors:FieldErrors<AuthFormData>){
  return(
    <>
      <div className={style.form_fields_container}>
          <input className={errors.email&&style.input_invalid} {...register("email",email_settings)} placeholder="Email address" />
          <p className={style.error_message}>{errors.email?.message as string}</p>
          <p id={style.forget_pass_p}>Please enter the email address you'd like your password reset information sent to</p>
      </div>
    </>
  )
}

function forgot_password_code_form(register:UseFormRegister<AuthFormData>, errors:FieldErrors<AuthFormData>, showPassword:boolean, setShowPassword:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <>
      <div className={style.form_fields_container}>
        <div className={style.password_input_wrapper}>
          <input type={showPassword?"text":"password"} className={`${style.password_input} ${errors.new_password?style.input_invalid:""}`} {...register("new_password",password_settings)} placeholder="New Password" />
          <button type="button" className={style.eye_btn} onClick={()=>setShowPassword(p=>!p)} aria-label={showPassword?"Hide password":"Show password"}>
            <EyeIcon visible={showPassword} error={!!errors.new_password} />
          </button>
        </div>
        {errors.new_password?.message&&<p className={style.error_message}>{errors.new_password?.message as string}</p>}
        <input {...register("key",{required:true})} placeholder="Reset key" />
        {errors.key && <p className={style.error_message}>Reset key is required</p>}
      </div>
    </>
  )
}

const SUBMIT_LABELS: Record<string, string> = {
  login: "Sign in",
  signup: "Sign Up",
  forget_password: "Request reset link",
  forget_password_code: "Set new password",
}
const LOADING_LABELS: Record<string, string> = {
  login: "Signing in...",
  signup: "Creating account...",
  forget_password: "Sending...",
  forget_password_code: "Submitting...",
}

export default function AuthForm() {
  const {register, handleSubmit, setError, reset, formState:{errors}} = useForm<AuthFormData>();
  const [authState, setAuthState] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string|null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/home';

  const handleAuthSwitch = () => {
    setShowPassword(false);
    setServerError(null);
    setResetSuccess(false);
    if(authState==="login") {
      setAuthState("signup");
      reset();
      return;
    }
    setAuthState("login");
    reset();
  }

  const handle_auth_submit = async (type:string, form:AuthFormData) => {
    setIsPending(true);
    setServerError(null);
    setResetSuccess(false);
    try {
      let res;
      switch (type) {
        case "login":
          res = await login(form.email!, form.password!);
          if(res.success){
            if(res.needsVerification) router.push('/verify');
            else router.push(redirectTo);
          } else {
            setError('password', { type:'manual', message:'Wrong password or email' });
          }
          break;

        case "forget_password":
          res = await forget(form.email!);
          if(res.success){
            setAuthState('forget_password_code');
          } else {
            setServerError(res.error ?? 'Something went wrong. Please try again.');
          }
          break;

        case "forget_password_code":
          res = await newPass(form.email!, form.new_password!, form.key!);
          if(res.success){
            setResetSuccess(true);
            setTimeout(() => {
              setAuthState('login');
              reset();
              setResetSuccess(false);
            }, 2000);
          } else {
            setServerError(res.error ?? 'Could not reset password. Please try again.');
          }
          break;

        case "signup":
          res = await signup(form.gender!, form.location!, 'GUEST', form.phone!, form.full_name!, form.email!, form.password!, form.date!);
          if(res.success){
            setAuthState("login");
            reset();
          } else {
            setServerError(res.error ?? 'Signup failed. Please try again.');
          }
          break;

        default:
          break;
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={style.auth_page_container}>
      <div className={`${style.form_and_logo_container} ${authState!=="signup"&&style.form_and_logo_container_login}`}>
        <div className={style.logo_container}>
          <Image loading="eager" src="/logo/logo.png" alt="logo_image" fill style={{objectFit:'contain'}} />
        </div>
        <form className={style.form_container} onSubmit={handleSubmit((data) => handle_auth_submit(authState, data))}>

          {authState==="login"&&login_form(register, setAuthState, errors, showPassword, setShowPassword)}
          {authState==="signup"&&signup_form(register, errors, showPassword, setShowPassword)}
          {authState==="forget_password"&&forgot_password_form(register, errors)}
          {authState==="forget_password_code"&&forgot_password_code_form(register, errors, showPassword, setShowPassword)}

          <AnimatePresence>
            <div className={`${authState==="login"&&style.submit_signBtn_container_login} ${style.submit_signBtn_container} ${(authState!=="login")&&style.submit_signBtn_container_signup}`}>
              {serverError && (
                <p className={style.server_error} role="alert">{serverError}</p>
              )}
              {resetSuccess && (
                <p className={style.server_success} role="status">Password updated! Redirecting...</p>
              )}
              <button
                type="submit"
                className={style.submit_btn}
                disabled={isPending}
              >
                {isPending
                  ? <span className={style.spinner} aria-hidden="true" />
                  : SUBMIT_LABELS[authState]
                }
              </button>
              <div className={style.signBTN_container}>
                {authState==="login"&&<div>Have you an account?</div>}
                {(authState==="login"||authState==="signup") && (
                  <button type="button" onClick={handleAuthSwitch} disabled={isPending}>
                    {authState==="login" ? <>Sign up</> : <>Back to sign in</>}
                  </button>
                )}
                {(authState==="forget_password"||authState==="forget_password_code") && (
                  <button type="button" onClick={handleAuthSwitch} disabled={isPending}>Back to sign in</button>
                )}
              </div>
            </div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
