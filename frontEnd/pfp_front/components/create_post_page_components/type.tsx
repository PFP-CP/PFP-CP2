import style from '@/styles/create_post_page_styles/create_post_computer.module.css'


export default function TypeSelector({register, setValue,selectedType}:{register:any,setValue:any,selectedType:any}){
  return(
    <>
      <input style={{display:"none"}} {...register} type="radio" value='apartment'/>
      <input style={{display:"none"}} {...register} type="radio" value='villa'/>
      <input style={{display:"none"}} {...register} type="radio" value='chalet'/>
      <button type='button' id='apartment' onClick={(e)=> setValue("house_type","apartment")} className={selectedType==='apartment' ? style.selected: undefined}>Apartment</button>
      <button type='button' id='villa' onClick={(e)=> setValue("house_type","villa")} className={selectedType==='villa' ? style.selected: undefined}>Villa</button>
      <button type='button' id='chalet' onClick={(e)=> setValue("house_type","chalet")} className={selectedType==='chalet'? style.selected: undefined}>Chalet</button>
    </>
  )
}