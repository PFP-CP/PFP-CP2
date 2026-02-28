'use client'
import { useState } from "react";
export default function Home() {
    const [gg,setgg] = useState(0);
  return (
    <>
    <div
     onClick={()=>setgg(1)}
    style={{
      height:'30px',
      width:'30px',
      backgroundColor:'white'
    }}
     >
    </div>this is nooks
    <button></button></>
  );
}