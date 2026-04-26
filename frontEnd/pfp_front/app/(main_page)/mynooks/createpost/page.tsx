'use client'
import { Suspense } from 'react'
import CreatePost from "./create_post_computer";

export default function Home() {
  return (
    <Suspense>
      <CreatePost />
    </Suspense>
  );
}
