"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { authedFetch } from "@/lib/authorization_handling";

<<<<<<< HEAD
export async function verify() {
  const response = await fetch(`http://127.0.0.1:8000/api/token/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "Angharok123?", email: "ba.tetbirt@ensta.edu.dz" }),
=======

export async function verify()
{
  const response = await fetch(`http://127.0.0.1:8000/api/token/pair`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({password:"Angharok123?",email:"ba.tetbirt@ensta.edu.dz"})
>>>>>>> 389ae4d (fix)
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

<<<<<<< HEAD
export async function createPost() {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
=======
export async function createPost(){
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}` 
>>>>>>> 389ae4d (fix)
    },
    body: JSON.stringify(postData),
  });

  console.log(response);
}

export async function deleteComment(postId: string, commentId: string) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(
    `http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
>>>>>>> 389ae4d (fix)
    },
  );
  return { success: response.ok };
}

export async function addComment(postId: string, comment: string, rating: number) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments`, {
    method: "POST",
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments`, {
    method: 'POST',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment, rating }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      success: false,
      status: response.status,
      detail: body?.detail ?? "Failed to submit.",
    };
  }

  return { success: true, status: response.status, detail: null };
}

<<<<<<< HEAD
export async function createReservation(
  postId: string,
  arrivalDate: string,
  departureDate: string,
) {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/`, {
    method: "POST",
=======
export async function createReservation(postId: string, arrivalDate: string, departureDate: string) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/`, {
    method: 'POST',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      post_id: postId,
      arrival_date: arrivalDate,
      departure_date: departureDate,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false as const, error: err?.detail ?? "Reservation failed" };
  }

  const data = await response.json();
  return {
    success: true as const,
    reservation: {
      id: data.id as number,
      arrival_date: data.arrival_date as string,
      departure_date: data.departure_date as string,
    },
  };
}

export async function getMyReservationsForPost(
  postId: string,
): Promise<{ id: number; arrival_date: string; departure_date: string }[]> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return [];
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/post/${postId}`, {
<<<<<<< HEAD
    method: "GET",
=======
    method: 'GET',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) return [];
  const data = await response.json();
  return (Array.isArray(data) ? data : []).map((r: any) => ({
    id: r.id,
    arrival_date: r.arrival_date,
    departure_date: r.departure_date,
  }));
}

export async function cancelReservation(reservationId: number, postId: string) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(
    `http://127.0.0.1:8000/api/Reservations/${reservationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Reservations/${reservationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
>>>>>>> 389ae4d (fix)
    },
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return {
      success: false as const,
      error: err?.detail ?? "Failed to cancel reservation",
    };
  }
  return { success: true as const };
}

export async function getComments(id: string) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}/comments`, {
    method: "GET",
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}/comments`, {
    method: 'GET',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 30, tags: [`post-${id}`] },
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
}

export async function getCurrentUserId(): Promise<number | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const response = await fetch(`http://127.0.0.1:8000/api/Account/my-profile/`, {
<<<<<<< HEAD
    method: "GET",
=======
    method: 'GET',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.id ?? null;
}

export async function checkIsSaved(postId: string): Promise<boolean> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return false;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/saved`, {
<<<<<<< HEAD
    method: "GET",
=======
    method: 'GET',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) return false;
  const data: { post_id: string }[] = await response.json();
  return data.some((s) => s.post_id === postId);
}

<<<<<<< HEAD
export async function savePost(
  postId: string,
): Promise<{ success: boolean; alreadySaved?: boolean }> {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: "POST",
=======
export async function savePost(postId: string): Promise<{ success: boolean; alreadySaved?: boolean }> {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: 'POST',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 409) return { success: true, alreadySaved: true };
  if (!response.ok) return { success: false };
  return { success: true };
}

export async function unsavePost(postId: string): Promise<{ success: boolean }> {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: "DELETE",
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/save`, {
    method: 'DELETE',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return { success: false };
  return { success: true };
}

export async function getSavedPosts(): Promise<
  {
    id: string;
    title: string;
    price: number;
    state: string;
    primary_image: string | null;
  }[]
> {
  const response = await authedFetch("/api/Posts/saved", {
    method: "GET",
    cache: "no-store",
  });
  const data: any[] = await response.json();
  console.log(data);
  return data.map((item) => ({
    id: item.post_id,
    title: item.title,
    price: item.price ?? 0,
    state: item.state || "blid",
    primary_image: item.primary_image || null,
  }));
}

<<<<<<< HEAD
export async function updateComment(
  postId: string,
  commentId: string,
  comment: string,
  rating: number,
) {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(
    `http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment, rating }),
=======
export async function updateComment(postId: string, commentId: string, comment: string, rating: number) {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${postId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
>>>>>>> 389ae4d (fix)
    },
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { success: false, detail: body?.detail ?? "Failed to update." };
  }
  return { success: true };
}

export async function rateSeller(postId: string, rating: number, isUpdate: boolean) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const method = isUpdate ? "PATCH" : "POST";
  const url = `http://127.0.0.1:8000/api/Posts/${postId}/rate-seller`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
=======
  const token = (await cookies()).get('token')?.value;
  const method = isUpdate ? 'PATCH' : 'POST';
  const url = `http://127.0.0.1:8000/api/Posts/${postId}/rate-seller`;
  const headers = { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` };
>>>>>>> 389ae4d (fix)
  const body = JSON.stringify({ rating });

  const response = await fetch(url, { method, headers, body });

  // POST returned 409 (already rated) — the GET endpoint has no auth so we can't
  // know in advance; retry transparently with PATCH.
  if (response.status === 409 && method === "POST") {
    const retry = await fetch(url, { method: "PATCH", headers, body });
    if (!retry.ok) {
      const err = await retry.json().catch(() => ({}));
      return { success: false, detail: err?.detail ?? "Failed to update rating." };
    }
    return { success: true, wasAlreadyRated: true };
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, detail: err?.detail ?? "Failed to rate." };
  }
  return { success: true, wasAlreadyRated: false };
}

export async function getPost(id: string) {
<<<<<<< HEAD
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}`, {
    method: "GET",
=======
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`http://127.0.0.1:8000/api/Posts/${id}`, {
    method: 'GET',
>>>>>>> 389ae4d (fix)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await response.json();
  return data;
}
