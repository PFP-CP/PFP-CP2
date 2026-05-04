import { imageItem } from "@/types/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://10.93.250.163:8000';

export async function uploadImagesFromClient(postId: string, images: Blob[]): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  await Promise.all(
    images.map((img, i) => {
      const formData = new FormData();
      formData.append('file', img, `image_${i}.webp`);
      return fetch(`${API_BASE}/api/Mynook/${postId}/pictures`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
    })
  );
}

export function compressImage(file:File, maxWidth = 1200, quality = 0.8){
  return new Promise((resolve) =>{
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload= ()=>{
      const scale= Math.min(1, maxWidth/img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/webp", quality);
      URL.revokeObjectURL(url);
    }
    img.src = url;
  })
}

const COMPRESSION_THRESHOLD = 500 * 1024; // 500 KB

export async function getCompressedNookImages(img:imageItem[]){
  let newImages=[];
  for(let i = 0 ; i<img.length ; i++){
    const file = img[i].file;
    if(!file) continue;
    if(file.size <= COMPRESSION_THRESHOLD){
      newImages.push(file);
    } else {
      newImages.push(await compressImage(file));
    }
  }
  return newImages;
}