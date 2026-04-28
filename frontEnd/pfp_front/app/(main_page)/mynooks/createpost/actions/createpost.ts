'use server'

import { logout } from "@/app/(authentication)/actions/login";
import { FEATURES } from "@/data/auth_data/data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { refreshToken, verifyToken } from "@/lib/authorization_handling";






export async function getNookDetail(postId: string) {
  const token = (await cookies()).get('token')?.value;
  const res = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function submitHouseUpdate(postId: string, data: CreatePostData) {
  let features_arr: number[] = [];
  data.features.forEach((feat) => { const id = FEATURES.get(feat); if (id) features_arr.push(id); });

  const hasFamily = data.categories.includes('family');
  const hasCouple = data.categories.includes('couple');
  const hasSingle = data.categories.includes('single');
  let types_code = 'AL';
  if (hasFamily && !hasCouple && !hasSingle) types_code = 'FA';
  else if (hasFamily && !hasCouple && hasSingle) types_code = 'NC';
  else if (hasFamily && hasCouple && !hasSingle) types_code = 'NM';

  const toSend: Record<string, any> = {
    house_type: data.house_type,
    description: data.description,
    price: Number(data.price_per_night),
    num_bedroom: Number(data.bedrooms),
    num_bathroom: Number(data.bathrooms),
    types_of_renters: types_code,
    county: data.county || '',
    state: data.wilaya,
    country: data.map_country || 'Algeria',
    longitude: data.longitude ? Number(data.longitude) : 0,
    latitude: data.latitude ? Number(data.latitude) : 0,
    feature_ids: features_arr,
    allows_animals: data.rules.includes('animals'),
    allows_smoking: data.rules.includes('smoking'),
    allows_noise: data.rules.includes('noise'),
  };
  if (data.beds && Number(data.beds) > 0) toSend.num_beds = Number(data.beds);
  if (data.max_tenants && Number(data.max_tenants) > 0) toSend.max_tenants = Number(data.max_tenants);

  const token = (await cookies()).get('token')?.value;
  const res = await fetch(`http://127.0.0.1:8000/api/Mynook/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(toSend),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('updateNook error:', res.status, text);
    return { success: false };
  }
  const response = await res.json().catch(() => null);
  if (!response?.id) return { success: false };
  return { success: true, post_id: String(response.id) };
}

export async function updateNook(postId: string, data: object, images: Blob[]) {
  const updateRes = await submitHouseUpdate(postId, data as CreatePostData);
  if (!updateRes.success) return false;
  if (images && images.length > 0) {
    await submitHouseImages(updateRes.post_id!, images);
  }
  return true;
}

export async function deleteNookPicture(postId: string, pictureId: number) {
  const token = (await cookies()).get('token')?.value;
  const res = await fetch(`http://127.0.0.1:8000/api/Mynook/${postId}/pictures/${pictureId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.ok;
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
  latitude?: string;
  longitude?: string;
  county?: string;
  map_country?: string;
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
    county: data.county || '',
    state: data.wilaya,
    country: data.map_country || "Algeria",
    longitude: data.longitude ? Number(data.longitude) : 0,
    latitude: data.latitude ? Number(data.latitude) : 0,
    feature_ids: features_arr,
    allows_animals: data.rules.includes('animals'),
    allows_smoking: data.rules.includes('smoking'),
    allows_noise: data.rules.includes('noise')
  }
  console.log(toSend);

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
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('createPost error:', res.status, text)
    return { success: false }
  }
  const response = await res.json().catch(() => null)
  if (!response?.id) return { success: false }
  return { success: true, post_id: response.id }

}

export async function createPost(data: object, images: any) {
  let newPostId = await submitHouseInformation(data);
  if (newPostId.success) {
    const uploadPictures = await submitHouseImages(newPostId.post_id, images);
    if (uploadPictures) return true;
    return false;
  }
  return false;

}