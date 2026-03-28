// ========== أنواع العقار ==========
export interface Property {
    id: number;
    title: string;
    location: string;
    wilaya: string;
    price: number;
    rating: number;
    image: string;
    images: string[];
    description: string;
    features: string[];
    rules: {
        smoking: boolean;
        animals: boolean;
        noise: boolean;
    };
    categories: {
        family: boolean;
        single: boolean;
        couple: boolean;
    };
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

// ========== أنواع الحجز ==========
export interface Reservation {
    id: number;
    propertyId: number;
    userId: number;
    arrivalDate: string;
    departureDate: string;
    visitors: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
}

// ========== أنواع المستخدم ==========
export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    role: "user" | "owner" | "admin";
    createdAt: string;
}

// ========== أنواع المفضلة ==========
export interface Favorite {
    id: number;
    userId: number;
    propertyId: number;
    property: Property;
    createdAt: string;
}

// ========== طلبات تسجيل الدخول ==========
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

// ========== طلبات تسجيل المستخدم ==========
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

// ========== طلبات إنشاء الحجز ==========
export interface ReservationRequest {
    propertyId: number;
    arrivalDate: string;
    departureDate: string;
    visitors: number;
}

// ========== طلبات إنشاء عقار ==========
export interface CreatePropertyRequest {
    title: string;
    location: string;
    wilaya: string;
    price: number;
    description: string;
    images: string[];
    features: string[];
    rules: {
        smoking: boolean;
        animals: boolean;
        noise: boolean;
    };
    categories: {
        family: boolean;
        single: boolean;
        couple: boolean;
    };
}

// ========== طلبات تحديث عقار ==========
export interface UpdatePropertyRequest {
    title?: string;
    location?: string;
    price?: number;
    description?: string;
    images?: string[];
    features?: string[];
    rules?: {
        smoking: boolean;
        animals: boolean;
        noise: boolean;
    };
    categories?: {
        family: boolean;
        single: boolean;
        couple: boolean;
    };
}

// ========== ردود API العامة ==========
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: boolean;
    error: string;
    code?: number;
}

// ========== الولايات ==========
export interface Wilaya {
    id: number;
    name: string;
    nameAr?: string;
    propertyCount?: number;
}