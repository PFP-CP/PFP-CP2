import {
    Property,
    CreatePropertyRequest,
    UpdatePropertyRequest,
    Reservation,
    ReservationRequest,
    Favorite,
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Wilaya,
    ApiResponse,
    SearchCriteria,
    SearchResult
} from "@/types/api_types"

// ========== API Configuration ==========
// Setting port to 8000 for Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ========== دالة مساعدة لإرسال الطلبات ==========
async function fetchAPI<T>(endpoint: string, options?: RequestInit, isRetry = false): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers = new Headers(options?.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401 && !isRetry) {
            // Try to refresh token
            const refreshSuccess = await api.refreshAccessToken();
            if (refreshSuccess) {
                // Retry once
                return fetchAPI<T>(endpoint, options, true);
            } else {
                // Clear tokens if refresh fails
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh");
                    // Optional: redirect to login
                    // window.location.href = "/login";
                }
            }
        }
        
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = error.detail || error.error || error.message || `API Error: ${response.status}`;
        console.error(`[API ERROR] ${response.status} at ${API_BASE_URL}${endpoint}:`, errorMessage);
        throw new Error(errorMessage);
    }

    return await response.json()
}

// ========== جميع دوال API المحدثة ==========
export const api = {

    refreshAccessToken: async (): Promise<boolean> => {
        try {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) return false;

            const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access) {
                    localStorage.setItem("token", data.access);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    },

    // ============================================
    // (Authentication & Account)
    // ============================================

    login: async (data: LoginRequest) => {
        const response = await fetchAPI<LoginResponse>("/api/Account/Login", {
            method: "POST",
            body: JSON.stringify(data),
        })

        if (response.tokens?.access && response.tokens?.refresh) {
            localStorage.setItem("token", response.tokens.access)
            localStorage.setItem("refresh", response.tokens.refresh)
        } else {
            const single = response.token || response.access;
            if (single) {
                localStorage.setItem("token", single);
            }
        }

        return response
    },

    register: async (data: RegisterRequest) => {
        return await fetchAPI<User>("/api/Account/Signup", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh")
    },

    getProfile: async () => {
        return await fetchAPI<User>("/api/Account/my-profile/")
    },

    updateProfile: async (data: Partial<User>) => {
        return await fetchAPI<User>("/api/Account/profile/", {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        return await fetchAPI<void>("/api/Account/changePassword/", {
            method: "PATCH",
            body: JSON.stringify({ oldPassword, newPassword }),
        })
    },

    // ============================================
    // (Posts / Main Page)
    // ============================================

    getMainPageProperties: async () => {
        try {
            const data = await fetchAPI<any[]>("/api/Posts/mainpage")
            if (!data || !Array.isArray(data)) return [];
            return data.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.Price || item.price || 0,
                state: item.State || item.state || "",
                average_rating: parseFloat(item.average_rating || item.rating || "0"),
                primary_image: item.primary_image || null,
                status: item.status || "available"
            }))
        } catch (error) {
            console.error("Failed to load main page properties:", error)
            throw error // re-throw so the page can display an error state
        }
    },

    getProperties: async () => {
        return await fetchAPI<Property[]>("/api/Posts/")
    },

    getPropertyById: async (id: string) => {
        return await fetchAPI<Property>(`/api/Posts/${id}`)
    },

    getFavorites: async () => {
        try {
            const data = await fetchAPI<any[]>("/api/Posts/saved")
            return data.map((item: any) => ({
                id: item.post_id,
                title: item.title,
                price: item.Price || 0,
                state: item.State || "",
                primary_image: item.primary_image || null,
            }))
        } catch (error) {
            console.error("Failed to load favorites:", error)
            throw error
        }
    },

    getReservations: async () => {
        try {
            return await fetchAPI<Reservation[]>("/api/Reservations/")
        } catch (error) {
            console.error("Failed to load reservations:", error)
            throw error
        }
    },

    // ============================================
    // (My Nooks)
    // ============================================

    getMyNooks: async (seller_id: string) => {
        return await fetchAPI<any>(`/api/Mynook/profile/${seller_id}`)
    },

    getMyNooksDash: async () => {
        try {
            const profile = await fetchAPI<any>("/api/Account/my-profile/")
            if (!profile || !profile.id) return []

            const publicProfile = await fetchAPI<any>(`/api/Mynook/profile/${profile.id}`)
            if (!publicProfile || !publicProfile.nooks) return []

            return (publicProfile.nooks || []).map((nook: any) => ({
                id: nook.id,
                title: nook.title,
                primary_image: nook.primary_image || nook.image,
                price: nook.price || nook.Price || 0,
                average_rating: nook.rating || nook.average_rating || 0,
                state: nook.wilaya || nook.state || "—",
                status: nook.status || "available",
                tenant: nook.tenant || null
            }))
        } catch (error) {
            console.error("Error fetching dashboard nooks:", error)
            return []
        }
    },

    createNook: async (data: CreatePropertyRequest) => {
        return await fetchAPI<Property>("/api/Mynook/", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    deleteNook: async (id: string) => {
        return await fetchAPI<void>(`/api/Mynook/${id}`, {
            method: "DELETE",
        })
    },

    publishNook: async (id: string) => {
        return await fetchAPI<void>(`/api/Posts/${id}/publish`, {
            method: "POST",
        })
    },

    markNookAsRented: async (id: string) => {
        return await fetchAPI<void>(`/api/Posts/${id}/mark-rented`, {
            method: "POST",
        })
    },

    // ============================================
    // Saved Posts)
    // ============================================

    getSavedPosts: async () => {
        return await fetchAPI<Property[]>("/api/Posts/saved")
    },

    savePost: async (postId: string) => {
        return await fetchAPI<void>(`/api/Posts/${postId}/save`, {
            method: "POST",
        })
    },

    unsavePost: async (postId: string) => {
        return await fetchAPI<void>(`/api/Posts/${postId}/save`, {
            method: "DELETE",
        })
    },

    // ============================================
    // (Reservations)
    // ============================================

    getReservations: async () => {
        return await fetchAPI<Reservation[]>("/api/Reservations/")
    },

    createReservation: async (data: ReservationRequest) => {
        return await fetchAPI<Reservation>("/api/Reservations/", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    deleteReservation: async (id: number) => {
        return await fetchAPI<void>(`/api/Reservations/${id}`, {
            method: "DELETE",
        })
    },

    // ============================================
    // (Comments)
    // ============================================

    getComments: async (postId: string) => {
        return await fetchAPI<any[]>(`/api/Posts/${postId}/comments`)
    },

    addComment: async (postId: string, comment: string) => {
        return await fetchAPI<any>(`/api/Posts/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ text: comment }),
        })
    },

    updateComment: async (postId: string, commentId: string, text: string) => {
        return await fetchAPI<any>(`/api/Posts/${postId}/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify({ text }),
        })
    },

    deleteComment: async (postId: string, commentId: string) => {
        return await fetchAPI<void>(`/api/Posts/${postId}/comments/${commentId}`, {
            method: "DELETE",
        })
    },

    // ============================================
    // (Search)
    // ============================================

    searchProperties: async (criteria: SearchCriteria) => {
        // Django Ninja reads the body as the schema directly (not wrapped)
        return await fetchAPI<SearchResult[]>("/api/Search/", {
            method: "POST",
            body: JSON.stringify(criteria),
        })
    },

    // ============================================
    //(Wilayas) - افتراضي
    // ============================================
    getWilayas: async () => {
        // إذا لم يكن موجوداً في الـ API، نستخدم الملف المحلي
        return await fetchAPI<Wilaya[]>("/api/wilayas").catch(() => {
            // Fallback to local data if endpoint doesn't exist
            return { data: [] } as any
        })
    },
}

