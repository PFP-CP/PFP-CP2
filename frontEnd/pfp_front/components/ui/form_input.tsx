'use client'
import {useRef} from 'react'
import styles from '@/styles/ui_css/form_input.module.css'
import { FormType } from '../abstract_components/auth_form';
import {z} from "zod"






type valueKeys = "email" | "gender" | "password" | "full_name" | "location" | "birth_date";

type inputType = {
  type: string;
  name:string;
  placeHolder?:string;
  required?:boolean;
  value:FormType;
  setValue:React.Dispatch<React.SetStateAction<FormType>>;
  setIsValid?:React.Dispatch<React.SetStateAction<boolean>>;
  isValid?:boolean;
  errors?:{full_name:string,email:string,password:string};
  setErrors?:React.Dispatch<React.SetStateAction<{full_name:string,email:string,password:string}>>;
  test?:boolean;
  input_ref?:any;
}

function validate(errors:{full_name:string,email:string,password:string},setErrors:React.Dispatch<React.SetStateAction<{full_name:string,email:string,password:string}>>,isValid:boolean,setIsValid:React.Dispatch<React.SetStateAction<boolean>>,inpt_type:string,inpt_value:string){
  
  let result:any;

  switch (inpt_type) {
    case "email":
      result = z.string()
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
    .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,"Full name: Only spaces,dashes and ' are allowed.")
    .safeParse(inpt_value);
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
    if (!new_errors.email && !new_errors.full_name && !new_errors.password) {
      setIsValid(true);
    }
    
  }
  
    


  }


export default function FormInput({type,name,placeHolder, required, value,setValue,setIsValid,isValid, test, errors,setErrors, input_ref}:inputType){
  let labelExists = true;
  const firstBlur = useRef(false);
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
    labelExists = !value[name as valueKeys];
    return(
    <div ref={name==="email"?input_ref:null} className={styles.input_container}>  
        <input  onBlur={handleValidate} required={required} value={value[name as valueKeys]} className={errors!==undefined && errors[name as "full_name"| "email"  | "password"] && test?`${styles.form_input} ${styles.form_input_invalid}`:styles.form_input} type={type} id={name} name={name} onChange={(e)=>handleChange(e)}/>    
        <label className={labelExists? styles.placeHolder:`${styles.placeHolder} ${styles.hidden}`} htmlFor={name}>{placeHolder}</label>
        {name==="password"&&<svg className={styles.password_lock_image} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={errors!==undefined && errors[name as "full_name"| "email"  | "password" ]?"red":"grey"} xmlns="http://www.w3.org/2000/svg">
          <path d="M9.23047 9H7.2002C6.08009 9 5.51962 9 5.0918 9.21799C4.71547 9.40973 4.40973 9.71547 4.21799 10.0918C4 10.5196 4 11.0801 4 12.2002V17.8002C4 18.9203 4 19.4801 4.21799 19.9079C4.40973 20.2842 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07902 21 7.19694 21H16.8031C17.921 21 18.48 21 18.9074 20.7822C19.2837 20.5905 19.5905 20.2842 19.7822 19.9079C20 19.4805 20 18.9215 20 17.8036V12.1969C20 11.079 20 10.5192 19.7822 10.0918C19.5905 9.71547 19.2837 9.40973 18.9074 9.21799C18.4796 9 17.9203 9 16.8002 9H14.7689M9.23047 9H14.7689M9.23047 9C9.10302 9 9 8.89668 9 8.76923V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8.76923C15 8.89668 14.8964 9 14.7689 9"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>}
    </div>
  )
}