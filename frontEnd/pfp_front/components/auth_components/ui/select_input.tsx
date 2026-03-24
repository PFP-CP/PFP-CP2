'use client'
import style from '@/styles/auth_styles/ui_css/auth/select_inpt.module.css'
import { ChangeEvent, useState } from "react";
import { select } from "@/types/types";





export default function Select({options, name,defaultValue,value, setValue}:select){
  return(
    <div>
    <select name={name}
            className={style.custom_select}
            defaultValue={defaultValue}
            value={value.location}
            onChange={(e:ChangeEvent<HTMLSelectElement>)=>setValue({...value,location:e.currentTarget.value})}
    >
      {
        options.map((option,index)=> <option key={index} value={option}>{option}</option>)
      }
    </select>
  </div>
  )
}