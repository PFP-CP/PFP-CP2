'use server'

import { logout } from "@/app/(authentication)/actions/login";
import { FEATURES } from "@/data/auth_data/data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { refreshToken, verifyToken } from "@/lib/authorization_handling";






async function deletePost(_postId: string) {
  // placeholder for future implementation
}


export async function submitHouseImages(postId: string, images: Array<Blob>) {
  const token = (await cookies()).get('token')?.value;
  const uploadPromises = images.map((img, i) => {
    const formData = new FormData();
    console.log("compressed image :", img);
    formData.append('file', img, `image_${i}.webp`);

    return fetch(`http://127.0.0.1:8000/api/Mynook/${postId}/pictures`, {
      method: "POST",
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }).then((res) => {
      const data = res.json()
      if (!res.ok) {
        console.error(`Upload failed for image ${i}`);
      }
      return data;
    });
  })
  try {
    await Promise.all(uploadPromises);
  } catch (err) {
    console.error(err);
    throw err;
  }
  //if all pictures got uploaded correctly return true
  return true;

}

interface CreatePostData {
  house_type: string;
  description: string;
  price_per_night: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  beds: string | number;
  max_tenants: string | number;
  categories: string[];
  wilaya: string;
  rules: string[];
  features: string[];
  location?: string;
}

export async function submitHouseInformation(data: CreatePostData) {
  let features_arr: number[] = [];
  data.features.forEach((feat) => features_arr.push(FEATURES.get(feat)));

  const toSend = {
    house_type: data.house_type,
    description: data.description,
    price: Number(data.price_per_night),
    room_num: 1,
    num_bedroom: Number(data.bedrooms),
    num_bathroom: Number(data.bathrooms),
    num_beds: Number(data.beds),
    max_tenants: Number(data.max_tenants),
    surface: 1,
    types_of_renters: {
      Families: data.categories.includes('family'),
      Couple: data.categories.includes('couple'),
      Single: data.categories.includes('single'),
    },
    county: 'hh',
    state: data.wilaya,
    country: "Algeria",
    longitude: 1,
    latitude: 1,
    feature_ids: features_arr,
    allows_animals: data.rules.includes('animals'),
    allows_smoking: data.rules.includes('smoking'),
    allows_noise: data.rules.includes('noise')
  }

  let token = (await cookies()).get('token')?.value;

  if (token) {
    const tokenValid = await verifyToken(token);
    if (!(await tokenValid)) {
      const refresh = (await cookies()).get('refresh')?.value
      const refreshed = await refreshToken(refresh!);

      if (!(await refreshed.success)) {
        logout();
        redirect('/authentication');
      }

    }
  }

  token = (await cookies()).get('token')?.value;

  const res = await fetch("http://127.0.0.1:8000/api/Mynook/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(toSend),

  })
  const response = await res.json();
  const res_status = await res.ok;
  if (res_status) {
    return { success: true, post_id: response.id }
  } else {
    return { success: false }
  }

}

export async function createPost(data: object, images: any) {
  let newPostId = await submitHouseInformation(data);
  console.log(newPostId);
  if (newPostId.success) {
    const uploadPictures = await submitHouseImages(newPostId.post_id, images);
    if (uploadPictures) return true;
    return false;
  }
  return false;

}