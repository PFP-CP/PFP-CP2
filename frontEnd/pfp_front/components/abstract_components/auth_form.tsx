"use client"
import {useState} from "react"
import Login_auth from "./login_auth"
import SignUp_auth from "@/components/abstract_components/signUp_auth"
import styles from "@/styles/layout_css/auth_layout.module.css"
export type FormType = {
  full_name: string;
  email: string;
  password: string;
  gender: string;
  location: string;
  birth_date: string;
}

export default function AuthForm(){
  const [isLogin, setIsLogin] = useState(true);

  return(

    
    <div className={styles.auth_container}>
      {isLogin?<Login_auth setIsLogin={setIsLogin}/>:<SignUp_auth setIsLogin={setIsLogin}/>}
    </div>
  )
}