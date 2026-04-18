'use client'
import Link from "next/link"
import Image from "next/image"
import style from "@/styles/post_page_styles/showcase.module.css"
import { showPostPicturesState } from "@/types/types"
import { HouseImage, PostData } from "@/types/api_types"
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { SAVE_LOGO_ACTIVE, SAVE_LOGO_INACTIVE, COPY_LINK_LOGO, TITLE_LOGO, LEAVE_TAB } from "@/public/svg/svg"
import { getWilayaName } from "@/data/auth_data/data"
import CarouselImages from "./carousel_images"
import { useMediaQuery } from "@mui/material"

const BACKEND_URL = 'http://127.0.0.1:8000';

function getImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
}

function PostHeader({ title, isSaved, onSaveToggle }: { title: string; isSaved: boolean; onSaveToggle: () => void }) {
  const screenWidth = useMediaQuery('(min-width:700px)');

  return (
    <div className={style.showcase_header}>
      <div className={style.title_container}>
        <div className={style.title_logo}><Link href={"#"}>{TITLE_LOGO}</Link></div>
        <div className={style.title}>{title}</div>
      </div>
      {screenWidth && <div className={style.post_actions}>
        <div className={style.copy_link_container}>
          <div className={style.copy_link_logo}>{COPY_LINK_LOGO}</div>
          <div className={style.copy_link}>Copy Link</div>
        </div>
        <div className={style.save_container} onClick={onSaveToggle} style={{ cursor: 'pointer' }}>
          <div className={style.save_logo}>{isSaved ? SAVE_LOGO_ACTIVE : SAVE_LOGO_INACTIVE}</div>
          <div className={style.save}>{isSaved ? 'Saved' : 'Save'}</div>
        </div>
      </div>}
    </div>
  );
}

function postImages(pictures: HouseImage[]) {
  return (
    <>
      {pictures.length > 2 ? picturesMoreThanTwo(pictures) : picturesLessThanTwo(pictures)}
    </>
  );

  function picturesMoreThanTwo(pics: HouseImage[]) {
    const [main, ...rest] = pics;
    return (
      <div className={style.pictures_container}>
        <PhotoProvider>
          <div className={style.main_picture}>
            <PhotoView src={getImageUrl(main.URL)}>
              <Image src={getImageUrl(main.URL)} alt="main_picture" width={650} height={500} style={{ objectFit: "cover" }} />
            </PhotoView>
          </div>
          <div className={style.side_pictures}>
            {rest.map((pic) => (
              <div key={pic.id} className={`${style.picture} ${style.emoreT3_picture}`}>
                <PhotoView src={getImageUrl(pic.URL)}>
                  <Image src={getImageUrl(pic.URL)} alt="side_picture" width={650} height={500} style={{ objectFit: "cover" }} />
                </PhotoView>
              </div>
            ))}
          </div>
        </PhotoProvider>
      </div>
    );
  }

  function picturesLessThanTwo(pics: HouseImage[]) {
    const [main, ...rest] = pics;
    return (
      <div className={`${style.pictures_container} ${style.lessT3_pictures_container}`}>
        <PhotoProvider>
          <div className={style.main_picture}>
            <PhotoView src={getImageUrl(main.URL)}>
              <Image src={getImageUrl(main.URL)} alt="main_picture" width={650} height={500} style={{ objectFit: "cover" }} />
            </PhotoView>
          </div>
          <div className={style.main_picture}>
            {rest.map((pic) => (
              <div key={pic.id} className={style.picture}>
                <PhotoView src={getImageUrl(pic.URL)}>
                  <Image src={getImageUrl(pic.URL)} alt="main_picture" width={650} height={500} style={{ objectFit: "cover" }} />
                </PhotoView>
              </div>
            ))}
          </div>
        </PhotoProvider>
      </div>
    );
  }
}

function image_navigation(
  setShowPictures: React.Dispatch<React.SetStateAction<boolean>>,
  post_data: PostData
) {
  const { house, location, title } = post_data;
  const bedroomStr = house.num_bedroom !== null
    ? `${house.num_bedroom} bedroom${house.num_bedroom !== 1 ? 's' : ''}`
    : null;
  const bathroomStr = house.num_bathroom !== null
    ? `${house.num_bathroom} bathroom${house.num_bathroom !== 1 ? 's' : ''}`
    : null;
  const roomStr = `${house.RoomNum} room${house.RoomNum !== 1 ? 's' : ''}`;
  const details = [bedroomStr, roomStr, bathroomStr].filter(Boolean).join(' · ');

  return (
    <div className={style.images_navigation}>
      <div className={style.location_details}>
        <div className={style.entire_home}>{`Entire home: ${formatPostTitle(post_data)}`}</div>
        <div className={style.house_details}>{details}</div>
      </div>
      <div className={style.show_pictures_container}>
        <button onClick={() => setShowPictures(true)}>Show all pictures</button>
      </div>
    </div>
  );
}

function display_images(
  setShowPictures: React.Dispatch<React.SetStateAction<boolean>>,
  pictures: HouseImage[]
) {
  return (
    <div className={style.all_pictures_container}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className={style.leave_show_pictures} onClick={() => setShowPictures(false)}>{LEAVE_TAB}</button>
      </div>
      <div className={style.show_pictures_container}>
        <PhotoProvider>
          {pictures.map((pic) => (
            <div key={pic.id} className={style.picture}>
              <PhotoView src={getImageUrl(pic.URL)}>
                <Image src={getImageUrl(pic.URL)} alt="side_picture" width={850} height={470} style={{ objectFit: "cover" }} />
              </PhotoView>
            </div>
          ))}
        </PhotoProvider>
      </div>
    </div>
  );
}


function formatPostTitle(post_data: PostData): string {
  const type = post_data.title.split(' in ')[0] || post_data.title;
  const wilaya = getWilayaName(post_data.location?.State);
  return wilaya ? `${type} in ${wilaya}` : type;
}

export default function PostShowcase({ setShowPictures, show_pictures, post_data, isSaved, onSaveToggle }: showPostPicturesState) {
  const pictures = post_data.house_pictures;
  const formattedTitle = formatPostTitle(post_data);
  return (
    <section className={style.post_showcase}>
      <>
        <PostHeader title={formattedTitle} isSaved={isSaved} onSaveToggle={onSaveToggle} />
        <div className={style.desktop_view}>
          {show_pictures
            ? display_images(setShowPictures, pictures)
            : postImages(pictures)
          }
        </div>
        <div className={style.mobile_view}>
          <CarouselImages pictures={pictures} />
        </div>
        {image_navigation(setShowPictures, post_data)}
      </>
    </section>
  );
}
