import styles from '@/styles/auth_styles/ui_css/auth/form_button.module.css'

type buttonType = {
  btnType?:'button' | 'submit' | 'reset';
  btnContent: string;
  ref?:any;
}

export default function FormButton({btnType='button',btnContent, ref}:buttonType){
  return(
    <button ref={ref} className={styles.form_button} type={btnType || 'button'}>{btnContent}</button>
  )
}