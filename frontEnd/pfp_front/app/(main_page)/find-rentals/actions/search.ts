"use server";
import { SearchCriteria, SearchResult } from "@/types/api_types";
import { cookies } from "next/headers";

export async function searchPosts(criteria: SearchCriteria): Promise<SearchResult[]> {
  const token = (await cookies()).get("token")?.value;
  const ap = criteria.allowed_people;
  const noneSelected = ap && !ap.Families && !ap.Couple && !ap.Single;
  const { renter_rating, max_renter_rating, post_rating, max_post_rating, ...rest } = criteria;
  const payload = {
    ...rest,
    renter_rating_min: renter_rating,
    renter_rating_max: max_renter_rating,
    post_rating_min: post_rating,
    post_rating_max: max_post_rating,
    // send null (not undefined) when no filter — backend accepts null as None and skips the filter
    allowed_people: !ap || noneSelected ? null : criteria.allowed_people,
    // posts are titled "apartment in X" (lowercase) — match case-insensitively
    house_type: criteria.house_type?.toLowerCase() || undefined,
  };
  const response = await fetch("http://127.0.0.1:8000/api/Search/", {
    method: "POST",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },

    body: JSON.stringify(payload),
    cache: "no-store",
  });
  console.log(payload)
  const data = await response.json();
  if (!response.ok) {
    const body = await response.text().catch(() => "(unreadable)");
    console.error(`Search failed ${response.status}:`, body);
    return [];
  }
  return data;
}
