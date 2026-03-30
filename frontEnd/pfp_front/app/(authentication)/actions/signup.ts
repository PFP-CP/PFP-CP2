import { wilayas } from "@/data/auth_data/data";


export async function signup(gender:string,state:string,type_of_user:string,phone_number:string,full_name:string,email:string,password:string,date_of_birth:string){
  wilayas.forEach((item)=>{
    if(item.name===state) state = item.code;
  })

  const response = await fetch("http://127.0.0.1:8000/api/Account/Signup",{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({
      gender,
      state,
      type_of_user,
      phone_number,
      full_name,
      email,
      password,
      date_of_birth
    }),
  })

  const data = await response.json();

  if(!data.Error){
    return {success:true};
  }
  return {success:false};

}

