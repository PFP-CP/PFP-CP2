import { Metadata } from "next"
import AuthForm from "@/components/auth_components/abstract_components/auth_form"
import { date } from "zod";

export const metadata: Metadata = {
  title:"Login",
  description:"This is the login page"
}
 async function test(){
  const email = "abdellahtt@gmail.com"
  const response = await fetch("http://127.0.0.1:8000/api/Account/passwordReset",{
    method:'PATCH',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
  });
  const data = await response.json()
  console.log(data)
}


export default function AuthenticationPage(){
  test();
  return(
    <>
      <AuthForm></AuthForm>
    </>
  )
}

