'use client'
import {useRef, useState} from 'react'
import styles from '@/styles/auth_styles/ui_css/auth/form_input.module.css'
import { inputType, keyValues_input,setErrors,errors } from '@/types/types'
import { z} from "zod"









function validate(errors:errors,setErrors:setErrors,isValid:boolean,setIsValid:React.Dispatch<React.SetStateAction<boolean>>,inpt_type:string,inpt_value:string){
  
  let result:any;

  switch (inpt_type) {
    case "email":
      result = z.string()
      .min(1,{error:"Email: email is required"})
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Email: Must be of the form some@thing.ext").safeParse(inpt_value);
      break;
    case "password":
      result = z.string().superRefine((val, ctx) => {

    if (val.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Password: Must be at least 8 characters",

      });
      return;
    }

    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password: Must contain uppercase letter"
      });
      return;
    }

    if (!/\d/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password: Must contain number"
      });
      return;
    }

    if (!/[^A-Za-z0-9]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password: Must contain special character",
      });
      return;
    }

  }).safeParse(inpt_value);
  break;
  case "full_name":
    result = z.string()
    .min(1,{error:"Full Name: full name is required"})
    .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,"Full name: Only spaces,dashes and ' are allowed.")
    .safeParse(inpt_value);
  break;
  case "birth_date":
    let current_time = new Date();
    result = z.date()
    .max(new Date(current_time.getTime() - 568025136000),{error:"Birth Date: Must be at least 18 years old"})
    .safeParse(inpt_value?new Date(inpt_value):new Date());
    break;
    default:
      return;
  }

  if(!result.success){
    const message = JSON.parse(result.error)[0].message;
    setErrors({...errors,[inpt_type]:message});
    setIsValid(false);
  }else{
    const new_errors = {...errors,[inpt_type]:""}; 
    setErrors({...errors,[inpt_type]:""});
    if(!new_errors.birth_date && !new_errors.email && !new_errors.full_name && !new_errors.password){
      setIsValid(true);
    }
    
  }
  }


export default function FormInput({type,name,placeHolder, required, value,setValue,setIsValid,isValid, test, errors,setErrors, input_ref}:inputType){
  let labelExists = true;
  const firstBlur = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const name = e.currentTarget.name;
    const new_value = e.currentTarget.value;
    setValue((prev)=>({...prev, [name]:new_value})); 
    if((test && errors && setErrors && setIsValid && isValid !==undefined) && firstBlur.current){
      validate(errors,setErrors,isValid,setIsValid,name,e.currentTarget.value);
    }     
  }

  const handleValidate = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if((test && errors && setErrors && setIsValid && isValid !==undefined) && !firstBlur.current){
      validate(errors,setErrors,isValid,setIsValid,name,e.currentTarget.value);
      firstBlur.current=true;
    }     
  }
    labelExists = !value[name as keyValues_input];
    return(
    <div ref={name==="email"?input_ref:null} className={styles.input_container}>
        <input  onBlur={handleValidate} required={required} value={value[name as keyValues_input]} className={errors!==undefined && errors[name as "full_name"| "email"  | "password"] && test?`${styles.form_input} ${styles.form_input_invalid}`:styles.form_input} type={name==="password"?(showPassword?"text":"password"):type} id={name} name={name} onChange={(e)=>handleChange(e)}/>
        <label className={labelExists? styles.placeHolder:`${styles.placeHolder} ${styles.hidden}`} htmlFor={name}>{placeHolder}</label>
        {name==="password"&&(
          <button type="button" className={styles.eye_button} onClick={()=>setShowPassword(prev=>!prev)} aria-label={showPassword?"Hide password":"Show password"}>
            {showPassword
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={errors!==undefined && errors["password"]?"red":"grey"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={errors!==undefined && errors["password"]?"red":"grey"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
            }
          </button>
        )}
    </div>
  )
}