'use client'
import PostShowcase from "@/components/post_page_components/post_showcase"
import { useState } from "react";
export default function PostPage() {
  const [show_pictures,setShowPictures] = useState(false);
  return (
    <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} />
  );
}