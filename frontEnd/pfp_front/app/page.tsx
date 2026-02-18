"use client"
import {useState} from 'react'
export default function Home() {
  const [exist, setExist] = useState(true);
  const handleClick = ()=>{
    setExist((prev)=>!prev);
  }
  return (
    <div>
       <div id="test" className={`test ${exist? "hidden":""}`}></div>
       <button onClick={handleClick}>click me</button>
    </div>

  );
}
