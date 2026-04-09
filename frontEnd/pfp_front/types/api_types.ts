// ========== أنواع العقار (Property) ==========
export interface Property {
    id: string;
    title: string;
    location: string;
    state: string;
    price: string;
    city: string;
    average_rating: number;
    primary_image: string;
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
    status: "reserved" | "available";  // ← تأكد من وجود هذا
    tenant?: {                         // ← تأكد من وجود هذا
        name: string;
        mobile: string;
        email: string;
    };
    created_at: string;
    updatedAt: string;
}
// ========== أنواع الحجز (Reservation) ==========
export interface Reservation {
    id: number;
    propertyId: number;
    property: {
        id: number;
        title: string;
        location: string;
        wilaya: string;
        price: number;
        rating: number;
        image: string;
    };
    userId: number;
    renter: {
        name: string;
        mobile: string;
        email: string;
    };
    arrivalDate: string;
    departureDate: string;
    visitors: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

// ========== طلبات إنشاء الحجز ==========
export interface ReservationRequest {
    propertyId: number;
    arrivalDate: string;
    departureDate: string;
    visitors: number;
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
    Identifier: string; // email
    password: string;
}

export interface LoginResponse {
    token?: string;
    user?: User;
    refresh?: string;
    access?: string;
    message?: string;
}

// ========== طلبات تسجيل المستخدم ==========
export interface RegisterRequest {
    full_name: string;
    email: string;
    password: string;
    date_of_birth: string; // YYYY-MM-DD
    gender: "male" | "female";
    state: string;
    type_of_user?: "GUEST" | "HOST";
    phone_number: string;
}

export interface UpdateProfileRequest {
    full_name?: string;
    date_of_birth?: string; // YYYY-MM-DD
    state?: string;
    gender?: string; // MALE or FEMALE
    phone_number?: string;
    email?: string;
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
    house_type: string;
    description: string;
    price: number;
    room_num: number;
    num_bedroom: number;
    num_bathroom: number;
    num_beds?: number;
    max_tenants?: number;
    surface: number;
    types_of_renters: string;
    county: string;
    state: string;
    country: string;
    longitude: number;
    latitude: number;
    feature_ids: number[];
    allows_animals: boolean;
    allows_smoking: boolean;
    allows_noise: boolean;
}

// ========== طلبات تحديث عقار ==========
export interface UpdatePropertyRequest {
    title?: string;
    description?: string;
    price?: number;
    room_num?: number;
    num_bedroom?: number;
    num_bathroom?: number;
    num_beds?: number;
    max_tenants?: number;
    surface?: number;
    types_of_renters?: string;
    county?: string;
    state?: string;
    country?: string;
    longitude?: number;
    latitude?: number;
    feature_ids?: number[];
    allows_animals?: boolean;
    allows_smoking?: boolean;
    allows_noise?: boolean;
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


// ========== أنواع صفحة My Nooks ==========
export interface Nook {
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
    status: "reserved" | "available";
    tenant?: {
        name: string;
        mobile: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ========== طلبات إنشاء/تحديث عقار ==========
export interface CreateNookRequest {
    house_type: string;
    description: string;
    price: number;
    room_num: number;
    num_bedroom: number;
    num_bathroom: number;
    num_beds?: number;
    max_tenants?: number;
    surface: number;
    types_of_renters: string;
    county: string;
    state: string;
    country: string;
    longitude: number;
    latitude: number;
    feature_ids: number[];
    allows_animals: boolean;
    allows_smoking: boolean;
    allows_noise: boolean;
}

export interface UpdateNookRequest {
    title?: string;
    description?: string;
    price?: number;
    room_num?: number;
    num_bedroom?: number;
    num_bathroom?: number;
    num_beds?: number;
    max_tenants?: number;
    surface?: number;
    types_of_renters?: string;
    county?: string;
    state?: string;
    country?: string;
    longitude?: number;
    latitude?: number;
    feature_ids?: number[];
    allows_animals?: boolean;
    allows_smoking?: boolean;
    allows_noise?: boolean;
}