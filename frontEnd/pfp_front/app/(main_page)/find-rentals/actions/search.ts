"use server";
import { SearchCriteria, SearchResult } from "@/types/api_types";

export async function searchPosts(criteria: SearchCriteria): Promise<SearchResult[]> {
  const ap = criteria.allowed_people;
  const noneSelected = ap && !ap.Families && !ap.Couple && !ap.Single;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { max_renter_rating, max_post_rating, ...rest } = criteria;
  const payload = {
    ...rest,
    // send null (not undefined) when no filter — backend accepts null as None and skips the filter
    allowed_people: !ap || noneSelected ? null : criteria.allowed_people,
    // posts are titled "apartment in X" (lowercase) — match case-insensitively
    house_type: criteria.house_type?.toLowerCase() || undefined,
  };
  console.log(payload);

  const response = await fetch("http://127.0.0.1:8000/api/Search/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(unreadable)");
    console.error(`Search failed ${response.status}:`, body);
    return [];
  }
  return response.json();
}
