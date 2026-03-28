
export async function forget(email:string){
  const response = await fetch("http://127.0.0.1:8000/api/Account/passwordReset",{
    method:'PATCH',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({email})
  });

  const data = await response.json();
  if(!data.Error){
    return {success:true};
  }
  return {success:false};
}


export async function newPass(email:string, new_password:string, key:string){
  const response = await fetch("http://127.0.0.1:8000/api/Account/passwordReset",{
    method:'PATCH',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({email,new_password,key})
  });
  const data = await response.json();

  if(!data.error){
    return {success:true};
  }

  return {success:false};

}