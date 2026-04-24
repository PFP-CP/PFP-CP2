'use client'
import PostShowcase from "@/components/post_page_components/post_showcase"
import HouseInformationAndBooking from "@/components/post_page_components/house_information_and_booking";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post_mobile_nav from "@/components/post_page_components/ui/post_mobile_nav";
import style from '@/styles/post_page_styles/general.module.css'
import { getPost, getCurrentUserId, checkIsSaved, savePost, unsavePost } from "./actions/getPost";
import Loading from "@/components/loading";
import { PostData } from "@/types/api_types";

const postCache = new Map<string, PostData>();

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [show_pictures,setShowPictures] = useState(false);
  const [postData,setPostData] = useState<PostData | null>(() => postCache.get(id) ?? null);
  const [loading,setLoading] = useState(() => !postCache.has(id));
  const [currentUserId,setCurrentUserId] = useState<number|null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(()=>{ getCurrentUserId().then(setCurrentUserId); },[]);

  const refetchPost = async () => {
    const post_res = await getPost(id);
    const data = {...post_res, comment_list: post_res.comments ?? []};
    postCache.set(id, data);
    setPostData(data);
  }

  useEffect(()=>{
    setShowPictures(false);
    const cached = postCache.get(id);
    if (cached) {
      setPostData(cached);
      setLoading(false);
      checkIsSaved(id).then(setIsSaved);
      return;
    }
    setLoading(true);
    setPostData(null);
    Promise.all([refetchPost(), checkIsSaved(id).then(setIsSaved)]).then(() => setLoading(false));
  },[id])

  const handleSaveToggle = async () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    const res = newSaved ? await savePost(id) : await unsavePost(id);
    if (!res.success) setIsSaved(!newSaved);
  };

  if(loading || !postData || postData.id !== id) return <Loading text="Loading post"/>
  return (
  <>
    <Post_mobile_nav isSaved={isSaved} onSaveToggle={handleSaveToggle} lat={postData.location?.Latitude} lng={postData.location?.Longitude}/>
    <main className={style.post_page_main}>
      <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} post_data={postData} isSaved={isSaved} onSaveToggle={handleSaveToggle}/>

      {!show_pictures&&<HouseInformationAndBooking post_data={postData} onCommentAdded={refetchPost} onReservationCreated={refetchPost} currentUserId={currentUserId}/>}
    </main>
  </>
  );
}