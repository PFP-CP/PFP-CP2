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
    ApiResponse
} from "@/types/api_types"

// ========== إعدادات API ==========
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// ========== دالة مساعدة لإرسال الطلبات ==========
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail || error.error || error.message || `API Error: ${response.status}`);
    }
    
    return await response.json()
}

// ========== جميع دوال API المحدثة ==========
export const api = {
    
    // ============================================
    // (Authentication & Account)
    // ============================================
    
    login: async (data: LoginRequest) => {
        const response = await fetchAPI<LoginResponse>("/api/Account/Login", {
            method: "POST",
            body: JSON.stringify(data),
        })
        const tokenToSave = response.token || response.access;
        if (tokenToSave) {
            localStorage.setItem("token", tokenToSave)
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
        return await fetchAPI<Property[]>("/api/Posts/mainpage")
    },
    
    getProperties: async () => {
        return await fetchAPI<Property[]>("/api/Posts/")
    },
    
    getPropertyById: async (id: number) => {
        return await fetchAPI<Property>(`/api/Posts/${id}`)
    },
    
    // ============================================
    // (My Nooks)
    // ============================================
    
    getMyNooks: async () => {
        return await fetchAPI<Property[]>("/api/Mynook/")
    },
    
    createNook: async (data: CreatePropertyRequest) => {
        return await fetchAPI<Property>("/api/Mynook/", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },
    
    deleteNook: async (id: number) => {
        return await fetchAPI<void>(`/api/Mynook/${id}`, {
            method: "DELETE",
        })
    },
    
    publishNook: async (id: number) => {
        return await fetchAPI<void>(`/api/Posts/${id}/publish`, {
            method: "POST",
        })
    },
    
    markNookAsRented: async (id: number) => {
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
    
    savePost: async (postId: number) => {
        return await fetchAPI<void>(`/api/Posts/${postId}/save`, {
            method: "POST",
        })
    },
    
    unsavePost: async (postId: number) => {
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
    
    getComments: async (postId: number) => {
        return await fetchAPI<any[]>(`/api/Posts/${postId}/comments`)
    },
    
    addComment: async (postId: number, comment: string) => {
        return await fetchAPI<any>(`/api/Posts/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ text: comment }),
        })
    },
    
    updateComment: async (postId: number, commentId: number, text: string) => {
        return await fetchAPI<any>(`/api/Posts/${postId}/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify({ text }),
        })
    },
    
    deleteComment: async (postId: number, commentId: number) => {
        return await fetchAPI<void>(`/api/Posts/${postId}/comments/${commentId}`, {
            method: "DELETE",
        })
    },
    
    // ============================================
    // (Search)
    // ============================================
    
    searchProperties: async (criteria: {
        wilaya?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string;
        features?: string[];
    }) => {
        return await fetchAPI<Property[]>("/api/Search/", {
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