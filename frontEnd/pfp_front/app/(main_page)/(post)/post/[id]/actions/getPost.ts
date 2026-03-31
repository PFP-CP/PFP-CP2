'use server'
import { cookies } from 'next/headers';


export async function verify()
{
  const response = await fetch(`http://127.0.0.1:8000/api/token/pair`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({password:"Angharok123?",email:"ba.tetbirt@ensta.edu.dz"})
  });
  const data = await response.json();
  console.log(data);

}
const postData = {
  title: "Modern Apartment in Hydra",
  price: 0,
  surface: 0,
  room_num: 0,
  county: "Hydra",
  state: "Alger",
  description: "",
  house_description: "",
  types_of_renters: "Al",
  country: "Algeria",
  num_bedroom: 0,
  num_bathroom: 0,
  latitude: 0,
  longitude: 0,
};

export async function createPost(){
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}` 
    },
    body:JSON.stringify(postData)
  });
  
  console.log(response);
  
}

// export async function getPost(id:string){
//   const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}`,{
//     method:'get',
//     headers:{
//       'Content-Type': 'application/json',
//       "Authorization": `Bearer ${token}` 
//     },
    
//   });

//   const data = await response.json();
// }