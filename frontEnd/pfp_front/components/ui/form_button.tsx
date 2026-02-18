import styles from '@/styles/ui_css/form_button.module.css'

type buttonType = {
  btnType?:'button' | 'submit' | 'reset',
  btnContent: string
}

export default function FormButton({btnType='button',btnContent}:buttonType){
  return(
    <button className={styles.form_button} type={btnType || 'button'}>{btnContent}</button>
  )
}