import style from '@/styles/post_page_styles/house_information_and_booking.module.css'
import { START_LOGO_X_SMALL } from '@/public/svg/svg'


export default function Comment({comment}:{comment:string}){
  return(
    <div className={style.comment}>
      <div className={style.user_container}>
        <div className={style.user_picture_and_name}>
          <div className={style.picture}></div>
          <div className={style.name}>Bennacer Sami Fares</div>
        </div>
        <div className={style.user_rating_and_date}>
          <div className={style.stars}>
            {START_LOGO_X_SMALL}
            {START_LOGO_X_SMALL}
            {START_LOGO_X_SMALL}
            {START_LOGO_X_SMALL}
            {START_LOGO_X_SMALL}
          </div>
          <div className={style.date}>january 2026</div>
        </div>
      </div>
      <div className={style.user_comment}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio commodi, architecto facere voluptatibus non, officiis, mollitia debitis quidem alias rem molestiae eaque vel aperiam excepturi ut. Blanditiis dolorem doloremque optio.</div>
    </div>

  )
}