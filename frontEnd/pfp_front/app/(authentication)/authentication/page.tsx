import { Metadata } from "next"
import AuthForm from "@/components/abstract_components/auth_form"

export const metadata: Metadata = {
  title:"Login",
  description:"This is the login page"
}



export default function AuthenticationPage(){
  
  return(
    <>
      <AuthForm></AuthForm>

    </>
  )
}