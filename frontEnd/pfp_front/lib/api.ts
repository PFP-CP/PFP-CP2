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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
            ...options?.headers,
        },
    })
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(error.error || error.message || `API Error: ${response.status}`)
    }
    
    return await response.json()
}

// ========== جميع دوال API ==========
export const api = {
    
    // ============================================
    // (Authentication)
    // ============================================
    login: async (data: LoginRequest) => {
        const response = await fetchAPI<ApiResponse<LoginResponse>>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        })
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
    
    logout: () => localStorage.removeItem("token"),
    
    getProfile: async () => fetchAPI<ApiResponse<User>>("/auth/profile"),
    
    updateProfile: async (data: Partial<User>) => fetchAPI<ApiResponse<User>>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    changePassword: async (oldPassword: string, newPassword: string) => fetchAPI<ApiResponse<void>>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
    }),
    
    // ============================================
    // (Properties / Nooks)
    // ============================================
    getProperties: async () => fetchAPI<ApiResponse<Property[]>>("/properties"),
    
    getPropertyById: async (id: number) => fetchAPI<ApiResponse<Property>>(`/properties/${id}`),
    
    getPropertiesByWilaya: async (wilaya: string) => fetchAPI<ApiResponse<Property[]>>(`/properties?wilaya=${wilaya}`),
    
    createProperty: async (data: CreatePropertyRequest) => fetchAPI<ApiResponse<Property>>("/properties", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    updateProperty: async (id: number, data: UpdatePropertyRequest) => fetchAPI<ApiResponse<Property>>(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    deleteProperty: async (id: number) => fetchAPI<ApiResponse<void>>(`/properties/${id}`, {
        method: "DELETE",
    }),
    
    // ملاحظة: getMyNooks و getMyProperties يشيران لنفس الـ Endpoint
    getMyNooks: async () => fetchAPI<ApiResponse<Property[]>>("/properties/my"),
    
    // Alias لـ getMyNooks للحفاظ على التوافقية إذا استخدمتها أماكن أخرى
    getMyProperties: async () => fetchAPI<ApiResponse<Property[]>>("/properties/my"),

    // ============================================
    // (Reservations)
    // ============================================
    getMyReservations: async () => fetchAPI<ApiResponse<Reservation[]>>("/reservations/my"),
    
    getReservations: async () => fetchAPI<ApiResponse<Reservation[]>>("/reservations"),
    
    getReservationById: async (id: number) => fetchAPI<ApiResponse<Reservation>>(`/reservations/${id}`),
    
    createReservation: async (data: ReservationRequest) => fetchAPI<ApiResponse<Reservation>>("/reservations", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    cancelReservation: async (id: number) => fetchAPI<ApiResponse<Reservation>>(`/reservations/${id}/cancel`, {
        method: "POST",
    }),
    
    // ============================================
    // (Favorites)
    // ============================================
    getFavorites: async () => fetchAPI<ApiResponse<Favorite[]>>("/favorites"),
    
    addFavorite: async (propertyId: number) => fetchAPI<ApiResponse<Favorite>>("/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId }),
    }),
    
    removeFavorite: async (propertyId: number) => fetchAPI<ApiResponse<void>>(`/favorites/${propertyId}`, {
        method: "DELETE",
    }),
    
    // ============================================
    // (Wilayas)
    // ============================================
    getWilayas: async () => fetchAPI<ApiResponse<Wilaya[]>>("/wilayas"),
    
    // ============================================
    // (Search)
    // ============================================
    searchProperties: async (params: {
        wilaya?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string;
        features?: string[];
    }) => {
        const queryString = new URLSearchParams(params as Record<string, string>).toString()
        return fetchAPI<ApiResponse<Property[]>>(`/properties/search?${queryString}`)
    },
}