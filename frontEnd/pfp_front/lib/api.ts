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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// ========== دالة مساعدة لإرسال الطلبات ==========
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // جلب Token من localStorage إن وجد
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            // إضافة Token إن وجد
            ...(token && { "Authorization": `Bearer ${token}` }),
            ...options?.headers,
        },
    })
    
    // معالجة الأخطاء
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(error.error || error.message || `API Error: ${response.status}`)
    }
    
    return await response.json()
}

// ========== جميع دوال API ==========
export const api = {
    
    // ============================================
    // المصادقة (Authentication)
    // ============================================
    
    login: async (data: LoginRequest) => {
        const response = await fetchAPI<ApiResponse<LoginResponse>>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        })
        // حفظ Token بعد نجاح تسجيل الدخول
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response
    },
    
    register: async (data: RegisterRequest) => {
        return await fetchAPI<ApiResponse<User>>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },
    
    logout: () => {
        localStorage.removeItem("token")
    },
    
    getProfile: async () => {
        return await fetchAPI<ApiResponse<User>>("/auth/profile")
    },
    
    updateProfile: async (data: Partial<User>) => {
        return await fetchAPI<ApiResponse<User>>("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        })
    },
    
    changePassword: async (oldPassword: string, newPassword: string) => {
        return await fetchAPI<ApiResponse<void>>("/auth/change-password", {
            method: "POST",
            body: JSON.stringify({ oldPassword, newPassword }),
        })
    },
    
    // ============================================
    // العقارات (Properties)
    // ============================================
    
    getProperties: async () => {
        return await fetchAPI<ApiResponse<Property[]>>("/properties")
    },
    
    getPropertyById: async (id: number) => {
        return await fetchAPI<ApiResponse<Property>>(`/properties/${id}`)
    },
    
    getPropertiesByWilaya: async (wilaya: string) => {
        return await fetchAPI<ApiResponse<Property[]>>(`/properties?wilaya=${wilaya}`)
    },
    
    createProperty: async (data: CreatePropertyRequest) => {
        return await fetchAPI<ApiResponse<Property>>("/properties", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },
    
    updateProperty: async (id: number, data: UpdatePropertyRequest) => {
        return await fetchAPI<ApiResponse<Property>>(`/properties/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    },
    
    deleteProperty: async (id: number) => {
        return await fetchAPI<ApiResponse<void>>(`/properties/${id}`, {
            method: "DELETE",
        })
    },
    
    getMyProperties: async () => {
        return await fetchAPI<ApiResponse<Property[]>>("/properties/my")
    },
    

// ========== الحجوزات (Reservations) ==========

getMyReservations: async () => {
    return await fetchAPI<ApiResponse<Reservation[]>>("/reservations/my")
},

getReservations: async () => {
    return await fetchAPI<ApiResponse<Reservation[]>>("/reservations")
},

getReservationById: async (id: number) => {
    return await fetchAPI<ApiResponse<Reservation>>(`/reservations/${id}`)
},

createReservation: async (data: ReservationRequest) => {
    return await fetchAPI<ApiResponse<Reservation>>("/reservations", {
        method: "POST",
        body: JSON.stringify(data),
    })
},

cancelReservation: async (id: number) => {
    return await fetchAPI<ApiResponse<Reservation>>(`/reservations/${id}/cancel`, {
        method: "POST",
    })
},
    // ============================================
    //  المفضلة (Favorites)
    // ============================================
    
    getFavorites: async () => {
        return await fetchAPI<ApiResponse<Favorite[]>>("/favorites")
    },
    
    addFavorite: async (propertyId: number) => {
        return await fetchAPI<ApiResponse<Favorite>>("/favorites", {
            method: "POST",
            body: JSON.stringify({ propertyId }),
        })
    },
    
    removeFavorite: async (propertyId: number) => {
        return await fetchAPI<ApiResponse<void>>(`/favorites/${propertyId}`, {
            method: "DELETE",
        })
    },
    

    
    getWilayas: async () => {
        return await fetchAPI<ApiResponse<Wilaya[]>>("/wilayas")
    },
    
    // ============================================
    //  البحث (Search)
    // ============================================
    
    searchProperties: async (params: {
        wilaya?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string;
        features?: string[];
    }) => {
        const queryString = new URLSearchParams(params as Record<string, string>).toString()
        return await fetchAPI<ApiResponse<Property[]>>(`/properties/search?${queryString}`)
    },
    // ========== العقارات (Properties/Nooks) ==========
// ... الدوال الموجودة مسبقاً ...

getMyNooks: async () => {
    return await fetchAPI<ApiResponse<Property[]>>("/properties/my")
},

deleteNook: async (id: number) => {
    return await fetchAPI<ApiResponse<void>>(`/properties/${id}`, {
        method: "DELETE",
    })
},

updateNookStatus: async (id: number, status: "reserved" | "available") => {
    return await fetchAPI<ApiResponse<Property>>(`/properties/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
},


}


