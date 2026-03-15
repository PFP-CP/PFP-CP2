'use client'
import Link from "next/link"
import Image from "next/image"
import style from "@/styles/post_page_styles/showcase.module.css"
import { showPostPicturesState } from "@/types/types"
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { SAVE_LOGO_ACTIVE,COPY_LINK_LOGO, TITLE_LOGO,LEAVE_TAB } from "@/public/svg/svg"




function postHeader(){
  return(
        <div className={style.showcase_header}>
          <div className={style.title_container}>
            <div className={style.title_logo}><Link href={"#"}>{TITLE_LOGO}</Link></div>
            <div className={style.title}>Studio - View Cathedrale d'Oran</div>
          </div>
          <div className={style.post_actions}>
            <div className={style.copy_link_container}>
              <div className={style.copy_link_logo}>{COPY_LINK_LOGO}</div>
              <div className={style.copy_link}>Copy Link</div>
            </div>
            <div className={style.save_container}>
              <div className={style.save_logo}>{SAVE_LOGO_ACTIVE}</div>
              <div className={style.save}>Save</div>
            </div>
          </div>
        </div>

  )
}

function postImages(pictures:string[]){
  return (
    <>
      {pictures.length>2?picturesMoreThanTwo(pictures):picturesLessThanTwo(pictures)}
    </>
  )

  function picturesMoreThanTwo(pictures:string[]){
  return(
    <div className={style.pictures_container}>
      <PhotoProvider>
          <div className={style.main_picture}>
            <PhotoView src={"/mock_data/picture1.png"}>
              <Image src="/mock_data/picture1.png" alt="main_picture" width={"650"} height={"500"} style={{ objectFit: "cover" }}/>
            </PhotoView>
          </div>
          <div className={style.side_pictures} >
            {pictures.map((pic)=>{
              return(
                  <div key={pic} className={`${style.picture} ${style.emoreT3_picture}`}>
                    <PhotoView src={`/mock_data/picture${pic}.png`}>
                      <Image src={`/mock_data/picture${pic}.png`} alt="side_picture" width={"650"} height={"500"} style={{ objectFit: "cover" }}/>
                    </PhotoView>
                  </div>
                )
              })}
            
          </div>
        </PhotoProvider>
        </div>
  )
}

function picturesLessThanTwo(pictures:string[]){
  return(
    <div className={`${style.pictures_container} ${style.lessT3_pictures_container}`}>
            <PhotoProvider>
          <div className={style.main_picture}>
            <PhotoView src={"/mock_data/picture1.png"}>
              <Image src="/mock_data/picture1.png" alt="main_picture" width={"650"} height={"500"} style={{ objectFit: "cover" }}/>
            </PhotoView>
          </div>
          <div className={style.main_picture} >
            {pictures.map((pic)=>{
              return(
                  <div key={pic} className={style.picture}>
                    <PhotoView src={`/mock_data/picture${pic}.png`}>
                      <Image src={`/mock_data/picture${pic}.png`} alt="main_picture" width={"650"} height={"500"} style={{ objectFit: "cover" }}/>
                    </PhotoView> 
                  </div>
                )
              })}
            
          </div>
                </PhotoProvider>
        </div>
  )
}
}

function image_navigation(setShowPictures:React.Dispatch<React.SetStateAction<boolean>>){
  return(
    <div className={style.images_navigation}>
          <div className={style.location_details}>
            <div className={style.entire_home}>Entire home : apartment - Oran, Algiers</div>
            <div className={style.house_details}>2 visitors . 1 bedroom . 1 bed . 1 bathroom</div>
          </div>
          <div className={style.show_pictures_container}>
            <button onClick={()=>setShowPictures(true)}>Show all pictures</button>
          </div>
    </div>
  )
}

function display_images(setShowPictures:React.Dispatch<React.SetStateAction<boolean>>, mock_pictures:string[]){
  return(
            <div className={style.all_pictures_container}>
              <div style={{display:"flex", justifyContent:"flex-end"}}>
                <button className={style.leave_show_pictures} onClick={()=>setShowPictures(false)}>{LEAVE_TAB}</button>
              </div>
              <div className={style.show_pictures_container}>  
                <PhotoProvider>
                {mock_pictures.map((pic)=>{
                return(
                  <div key={pic} className={style.picture}>
                    <PhotoView src={`/mock_data/picture${pic}.png`}>
                      <Image src={`/mock_data/picture${pic}.png`} alt="side_picture" width={"850"} height={"470"} style={{ objectFit: "cover" }}/>
                    </PhotoView>
                  </div>
                  )
                })}
                </PhotoProvider>
                </div>
            </div>
            
            )
}

export default function PostShowcase({setShowPictures,show_pictures}:showPostPicturesState){

  const mock_pictures = ['1','5','4','3','6']
  return(
    <section className={style.post_showcase}>
      {show_pictures ?<>
              {display_images(setShowPictures,mock_pictures)}
            </> 
            :<>
              {postHeader()}
              {postImages(mock_pictures)}
              {image_navigation(setShowPictures)}
            </>
            }
    </section>
  )
}