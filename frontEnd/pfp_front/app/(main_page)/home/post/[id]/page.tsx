'use client'
import PostShowcase from "@/components/post_page_components/post_showcase"
import HouseInformationAndBooking from "@/components/post_page_components/house_information_and_booking";
import { useState } from "react";
export default function PostPage() {
  const [show_pictures,setShowPictures] = useState(false);
  return (
  <main style={{
      padding: "2rem",
      backgroundColor:"white",
  }}>
    <PostShowcase show_pictures={show_pictures} setShowPictures={setShowPictures} />
    <HouseInformationAndBooking />
  </main>
  );
}