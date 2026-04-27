'use server'
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';


export async function verify()
{
  const response = await fetch(`http://127.0.0.1:8000/api/token/pair`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({password:"Angharok123?",email:"ba.tetbirt@ensta.edu.dz"})
  });
  const data = await response.json();
  console.log(data);

}
const postData = {
  title: "Modern Apartment in Hydra",
  price: 0,
  surface: 0,
  room_num: 0,
  county: "Hydra",
  state: "Alger",
  description: "",
  house_description: "",
  types_of_renters: "Al",
  country: "Algeria",
  num_bedroom: 0,
  num_bathroom: 0,
  latitude: 0,
  longitude: 0,
};

export async function createPost(){
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}` 
    },
    body:JSON.stringify(postData)
  });
  
  console.log(response);
  
}

export async function deleteComment(postId: string, commentId: string) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
  });
  if (response.ok) revalidateTag(`post-${postId}`);
  return { success: response.ok };
}

export async function addComment(postId: string, comment: string, rating: number) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ comment, rating }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { success: false, status: response.status, detail: body?.detail ?? 'Failed to submit.' };
  }

  revalidateTag(`post-${postId}`);
  return { success: true, status: response.status, detail: null };
}

export async function createReservation(postId: string, arrivalDate: string, departureDate: string) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ post_id: postId, arrival_date: arrivalDate, departure_date: departureDate }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, error: err?.detail ?? 'Reservation failed' };
  }

  revalidateTag(`post-${postId}`);
  return { success: true };
}

export async function getComments(id: string) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    next: { revalidate: 30, tags: [`post-${id}`] },
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
}

export async function getCurrentUserId(): Promise<number | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  const response = await fetch(`http://127.0.0.1:8000/api/Account/my-profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.id ?? null;
}

export async function checkIsSaved(postId: string): Promise<boolean> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return false;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/saved`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    cache: 'no-store',
  });
  if (!response.ok) return false;
  const data: { post_id: string }[] = await response.json();
  return data.some((s) => s.post_id === postId);
}

export async function savePost(postId: string): Promise<{ success: boolean; alreadySaved?: boolean }> {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
  });
  if (response.status === 409) return { success: true, alreadySaved: true };
  if (!response.ok) return { success: false };
  return { success: true };
}

export async function unsavePost(postId: string): Promise<{ success: boolean }> {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
  });
  if (!response.ok) return { success: false };
  return { success: true };
}

export async function getSavedPosts(): Promise<{ id: string; title: string; price: number; state: string; primary_image: string | null }[]> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return [];
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/saved`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) return [];
  const data: any[] = await response.json();
  return data.map((item) => ({
    id: item.post_id,
    title: item.title,
    price: item.Price || 0,
    state: item.State || '',
    primary_image: item.primary_image || null,
  }));
}

export async function updateComment(postId: string, commentId: string, comment: string, rating: number) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ comment, rating }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { success: false, detail: body?.detail ?? 'Failed to update.' };
  }
  revalidateTag(`post-${postId}`);
  return { success: true };
}

export async function rateSeller(postId: string, rating: number, isUpdate: boolean) {
  const token = (await cookies()).get('token')?.value;
  const method = isUpdate ? 'PATCH' : 'POST';
  const url = `http://127.0.0.1:8000/api/Posts/${postId}/rate-seller`;
  const headers = { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` };
  const body = JSON.stringify({ rating });

  const response = await fetch(url, { method, headers, body });

  // POST returned 409 (already rated) — the GET endpoint has no auth so we can't
  // know in advance; retry transparently with PATCH.
  if (response.status === 409 && method === 'POST') {
    const retry = await fetch(url, { method: 'PATCH', headers, body });
    if (!retry.ok) {
      const err = await retry.json().catch(() => ({}));
      return { success: false, detail: err?.detail ?? 'Failed to update rating.' };
    }
    revalidateTag(`post-${postId}`);
    return { success: true, wasAlreadyRated: true };
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, detail: err?.detail ?? 'Failed to rate.' };
  }
  revalidateTag(`post-${postId}`);
  return { success: true, wasAlreadyRated: false };
}

export async function getPost(id: string) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    next: { revalidate: 60, tags: [`post-${id}`] },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  const data = await response.json();
  return data;
}