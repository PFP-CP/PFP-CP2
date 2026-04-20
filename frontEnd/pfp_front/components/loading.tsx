import style from '@/styles/loading.module.css'

export default function Loading({ text }: { text?: string }) {
  return (
    <div className={style.page}>
      <div className={style.spinner} />
      {text && <p className={style.text}>{text}</p>}
    </div>
  )
}
