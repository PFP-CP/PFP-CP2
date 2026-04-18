import style from '@/styles/loading.module.css'






export default function Loading({text}:{text:string}){
  return(
    <div className={style.loading}>{text}</div>
  )
}