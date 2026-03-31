import styles from "@/styles/auth_styles/ui_css/auth/radio.module.css"
import { radio} from "@/types/types"


export default function RadioButton({register}:{register:UseFormRegister<FieldValues>}){


  return(
    <div className={styles.radio_container}>
     <div className={styles.left_container}> 
      <input  {...register("gender")} className={styles.custom_radio} type="radio" value={'male'} id="Male"/>
      <label className={styles.label_left} htmlFor="Male">Male</label>
    </div>
     <div className={styles.right_container}> 
      <input  {...register("gender")} className={styles.custom_radio} type="radio" value={'female'} id="Female"/>
      <label className={styles.label_right} htmlFor="Female">Female</label>
      </div>
    </div>
  )
}