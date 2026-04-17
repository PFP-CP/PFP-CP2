import { imageItem } from "@/types/types";

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

export async function getCompressedNookImages(img:imageItem[]){
  let newImages=[];
  for(let i = 0 ; i<img.length ; i++){
    newImages.push(await compressImage(img[i].file))
  }
  return newImages;
}