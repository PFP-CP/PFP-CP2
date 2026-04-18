'use client'
import PostShowcase from "@/components/post_page_components/post_showcase"
import HouseInformationAndBooking from "@/components/post_page_components/house_information_and_booking";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post_mobile_nav from "@/components/post_page_components/ui/post_mobile_nav";
import style from '@/styles/post_page_styles/general.module.css'
import { getPost,getComments,getCurrentUserId } from "./actions/getPost";
import Loading from "@/components/loading";
import { PostData } from "@/types/api_types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [show_pictures,setShowPictures] = useState(false);
  const [postData,setPostData] = useState<PostData | null>(null);
  const [loading,setLoading] = useState(true);
  const [currentUserId,setCurrentUserId] = useState<number|null>(null);

  useEffect(()=>{ getCurrentUserId().then(setCurrentUserId); },[]);
  const refetchPost = async () => {
    const post_res = await getPost(id);
    const comments_res = await getComments(id);
    console.log(post_res);
    setPostData({...post_res, comment_list:[...comments_res]});
  }

  useEffect(()=>{
    setLoading(true);
    setPostData(null);
    setShowPictures(false);
    refetchPost().then(() => setLoading(false));
  },[id])

  if(loading || !postData || postData.id !== id) return <Loading text="Loading post"/>
  return (
  <>
    <Post_mobile_nav/>
    <main className={style.post_page_main}>
      <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} post_data={postData} />

      {!show_pictures&&<HouseInformationAndBooking post_data={postData} onCommentAdded={refetchPost} currentUserId={currentUserId}/>}
    </main>
  </>
  );
}