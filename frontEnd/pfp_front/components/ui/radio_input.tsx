import styles from "@/styles/ui_css/radio.module.css"
import { FormType } from "../abstract_components/auth_form"

type radio={
  value:FormType;
  setValue:React.Dispatch<React.SetStateAction<FormType>>;
}

export default function RadioButton({value, setValue}:radio){


  return(
    <div className={styles.radio_container}>
     <div className={styles.left_container}> 
      <input onClick={()=>setValue({...value,gender:"male"})} className={styles.custom_radio} type="radio" checked={value.gender==="male"?true:false} name="Gender" id="Male"/>
      <label className={styles.label_left} htmlFor="Male">Male</label>
      </div>
     <div className={styles.right_container}> 
      <input onClick={()=>setValue({...value,gender:"female"})} className={styles.custom_radio} type="radio" checked={value.gender==="female"?true:false} name="Gender" id="Female"/>
      <label className={styles.label_right} htmlFor="Female">Female</label>
      </div>
    </div>
  )
}