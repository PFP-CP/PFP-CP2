import style from '@/styles/create_post_page_styles/create_post_computer.module.css'


const CATEGORIES = ['family','single','couple'];
export default function CategoriesSelection({register, setValue,watchedCheckBoxes}:{register:any,setValue:any,watchedCheckBoxes:any}){
  const toggleCheckbox = (section_name:string,item:string)=>{
      if(watchedCheckBoxes[section_name].includes(`${item}`)){
        setValue(`${section_name}`,watchedCheckBoxes[section_name].filter((el)=>el!==item))
      }else{
        setValue(`${section_name}`,[...watchedCheckBoxes[section_name],`${item}`])
      }
  }
  return<>
  
  {CATEGORIES.map((category)=>{
                    return(
                      <div key={category}>
                        <input style={{display:"none"}} {...register('categories')} type="checkbox" value={category}/>
                        <button type='button' id={category} onClick={()=> toggleCheckbox("categories",category)} className={watchedCheckBoxes.categories.includes(category) ? style.selected: undefined}>{category.charAt(0).toLocaleUpperCase()+category.slice(1)}</button>
                      </div>
                    )
                  })}  
  </>
}