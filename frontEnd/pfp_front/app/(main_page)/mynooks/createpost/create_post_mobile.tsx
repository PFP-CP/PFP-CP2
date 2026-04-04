'use client'
import style from '@/styles/create_post_page_styles/create_post_page.module.css'
import Uploader from "@/components/create_post_page_components/image_uploader";
import { useEffect, useRef,useState } from 'react';
import { useForm } from 'react-hook-form';
import { number } from 'zod';
import { wilayas } from '@/data/auth_data/data';
import Create_post_mobile_nav from '@/components/create_post_page_components/create_post_page_mobile_nav';
function compressImages(file:File, maxWidth = 1200, quality = 0.8){
  return new Promise((resolve) =>{
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload= ()=>{
      const scale= Math.min(1, maxWidth/img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/webp", quality);
      URL.revokeObjectURL(url);
    }
  })
}
//Notes for later
// all inputs must be required
// checkbox array must not be empty
//add map api
const CATEGORIES = ['family','single','couple'];
const RULES = ['animals','smoking','noise'];
const FEATURES = ['pool','wifi','heating','television','kitchen','microwave','dishes','freezer','stove','oven','fridge','washing_machine','cleaning_product','air_conditioning','parking','sea_view'];

export default function CreatePostMobile() {
  const [NumberOf_Inputs,setNumberOf_Inputs] = useState({1:false,2:false,3:false});
  const [tenantsAndPriceActive, setTenantsAndPriceActive] = useState({1:false,2:false})
  const {register, handleSubmit,setValue, watch,setFocus,getValues} = useForm({
    defaultValues:{
      house_type:'apartment',
      wilaya:"01",
      categories:[],
      rules:[],
      features:[],
    }
  });
  const selectedType = watch('house_type');
  const watchedCheckBoxes = {
    categories:watch('categories'),
    rules:watch('rules'),
    features:watch('features'),
  }
  const numberOf_Values = {
    1:getValues('bedrooms'),
    2:getValues('beds'),
    3:getValues('bathrooms')
  }
  const tenantsAndPrice_Values={
    1:getValues('max_tenants'),
    2:getValues('price_per_night')
  }
  const location = watch('location');
  const toggleCheckbox = (section_name:string,item:string)=>{
    if(watchedCheckBoxes[section_name].includes(`${item}`)){
      setValue(`${section_name}`,watchedCheckBoxes[section_name].filter((el)=>el!==item))
    }else{
      setValue(`${section_name}`,[...watchedCheckBoxes[section_name],`${item}`])
    }
  }


  useEffect(()=>{
    if(NumberOf_Inputs[1]) setFocus('bedrooms');
    if(NumberOf_Inputs[2]) setFocus('beds');
    if(NumberOf_Inputs[3]) setFocus('bathrooms');
    if(tenantsAndPriceActive[1]) setFocus('max_tenants');
    if(tenantsAndPriceActive[2]) setFocus('price_per_night');
    if(!numberOf_Values[1]) number() 
  },[NumberOf_Inputs,tenantsAndPriceActive])
  return(<> 
    <Create_post_mobile_nav />
    <form onSubmit={handleSubmit((data)=> console.log(data))}>
    <div className={style.create_post_page_container}>
    <Uploader/>
      <div className={style.section_container}>
        <div className={style.section_title}>
          Type
        </div>
        <div className={style.section_radio}>
            <input style={{display:"none"}} {...register('house_type')} type="radio" value='apartment'/>
            <input style={{display:"none"}} {...register('house_type')} type="radio" value='villa'/>
            <input style={{display:"none"}} {...register('house_type')} type="radio" value='chalet'/>
            <button type='button' id='apartment' onClick={(e)=> setValue("house_type","apartment")} className={selectedType==='apartment' ? style.selected: undefined}>Apartment</button>
            <button type='button' id='villa' onClick={(e)=> setValue("house_type","villa")} className={selectedType==='villa' ? style.selected: undefined}>Villa</button>
            <button type='button' id='chalet' onClick={(e)=> setValue("house_type","chalet")} className={selectedType==='chalet'? style.selected: undefined}>Chalet</button>
          </div>
      </div>
      <div className={style.house_rooms_and_willaya}>
        <div className={style.section_container}>
          <div className={style.section_title}>
            Number of
          </div>
          <div onClick={()=>setNumberOf_Inputs((prev)=>{return{...prev,1:true}})} className={ !numberOf_Values[1]?style.number_of_buttons:`${style.number_of_buttons} ${style.filled_input}`}>
            {NumberOf_Inputs[1] ?<input type="number" {...register('bedrooms')} min={0} onBlur={()=>setNumberOf_Inputs((prev)=>{return {...prev,1:false}})}/>:`${numberOf_Values[1] || "Bedrooms"}`} 
          </div>
          <div onClick={()=>setNumberOf_Inputs((prev)=>{return{...prev,2:true}})} className={ !numberOf_Values[2]?style.number_of_buttons:`${style.number_of_buttons} ${style.filled_input}`}>
            {NumberOf_Inputs[2] ?<input type="number" {...register('beds')} min={0} onBlur={()=>setNumberOf_Inputs((prev)=>{return {...prev,2:false}})} />:`${numberOf_Values[2] || "Beds"}`}
          </div>
          <div onClick={()=>setNumberOf_Inputs((prev)=>{return{...prev,3:true}})} className={ !numberOf_Values[3]?style.number_of_buttons:`${style.number_of_buttons} ${style.filled_input}`}>
            {NumberOf_Inputs[3] ?<input type="number" {...register('bathrooms')} min={0} onBlur={()=>setNumberOf_Inputs((prev)=>{return {...prev,3:false}})}/>:`${numberOf_Values[3] || "Bathrooms"}`}
          </div>
        </div>

        <div className={style.section_container}>
          <select {...register('wilaya')}>
            {wilayas.map((wilaya)=> <option key={wilaya.code} value={wilaya.code}>{wilaya.name}</option> )}
          </select>
        </div>

      </div>
      
      <div className={style.section_container}>
          <div className={style.section_title}>
            Location
          </div>
          <input className={location?style.filled_input:undefined} type="url" {...register('location')} placeholder='Copy the link to your house on Google Maps' />
      </div>

      <div className={style.section_container}>
          <div className={style.tenants_and_price}>
            <div onClick={()=>setTenantsAndPriceActive((prev)=>{return{...prev,1:true}})} className={ tenantsAndPrice_Values[1] ? style.filled_input:undefined}>
              {tenantsAndPriceActive[1] ?<input type="number" {...register('max_tenants')} min={0} onBlur={()=>setTenantsAndPriceActive((prev)=>{return {...prev,1:false}})}/>:`${tenantsAndPrice_Values[1] || "Max number of tenants"}`} 
            </div>
            <div onClick={()=>setTenantsAndPriceActive((prev)=>{return{...prev,2:true}})} className={ tenantsAndPrice_Values[2] ? style.filled_input:undefined}>
              {tenantsAndPriceActive[2] ?<input type="number" {...register('price_per_night')} min={0} onBlur={()=>setTenantsAndPriceActive((prev)=>{return {...prev,2:false}})} />:`${tenantsAndPrice_Values[2] || "Price per night"}`}
            </div>
          </div>
      </div>

      <div className={style.section_container}>
          <div className={style.section_title}>
            Categories
          </div>
          <div className={style.section_chechbox}>
            {CATEGORIES.map((category)=>{
              return(
                <div key={category}>
                  <input style={{display:"none"}} {...register('categories')} type="checkbox" value={category}/>
                  <button type='button' id={category} onClick={()=> toggleCheckbox("categories",category)} className={watchedCheckBoxes.categories.includes(category) ? style.selected: undefined}>{category.charAt(0).toLocaleUpperCase()+category.slice(1)}</button>
                </div>
              )
            })}
            
            
          </div>
      </div>

      <div className={style.section_container}>
          <div className={style.section_title}>
            Rules
          </div>
          <div className={style.section_chechbox}>
            {RULES.map((rule)=>{
              return(
                <div key={rule}>
                  <input style={{display:"none"}} {...register('rules')} type="checkbox" value={rule}/>
                  <button type='button' id={rule} onClick={()=> toggleCheckbox("rules",rule)} className={watchedCheckBoxes.rules.includes(rule) ? style.selected: undefined}>{rule.charAt(0).toLocaleUpperCase()+rule.slice(1)}</button>
                </div>
              )
            })}
            
            
          </div>
      </div>

      <div className={style.section_container}>
          <div className={style.section_title}>
            Features
          </div>
          <div className={style.section_chechbox}>
            {FEATURES.map((feature)=>{
              return(
                <div key={feature}>
                  <input style={{display:"none"}} {...register('features')} type="checkbox" value={feature}/>
                  <button type='button' id={feature} onClick={()=> toggleCheckbox("features",feature)} className={watchedCheckBoxes.features.includes(feature) ? style.selected: undefined}>{(feature.charAt(0).toLocaleUpperCase()+feature.slice(1)).replaceAll('_',' ')}</button>
                </div>
              )
            })}
            
            
          </div>
      </div>
      <div className={style.section_container}>
        <textarea className={style.description} rows={10} {...register('description')} placeholder='write a description of your nook'/>
      </div>

      <button type='submit' id={style.submit_button}>Post your nook</button>
      </div>

    
    </form>
    </>
  );
}