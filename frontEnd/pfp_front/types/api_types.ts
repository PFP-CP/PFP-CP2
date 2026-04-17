// ========== أنواع العقار (Property) ==========
export interface Property {
    id: string;
    title: string;
    location?: string;
    state: string;
    price: number | string;
    city?: string;
    average_rating: number;
    primary_image: string | null;
    images?: string[];
    description?: string;
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
    ownerId?: number;
    status: "reserved" | "available";
    tenant?: {
        name: string;
        mobile: string;
        email: string;
    };
    created_at?: string;
    updatedAt?: string;
}

// ========== أنواع الحجز (Reservation) ==========
export interface Reservation {
    id: number;
    renter: {
        id: number;
        full_name: string;
        email: string;
        phone: number | string | null;
    };
    post: {
        id: string; // UUID
        Title: string;
        House: {
            id: number;
            Price: number;
            Description: string;
            wilaya: string;
            photo: string;
            rating?: number;
        };
    };
    arrival_date: string;
    departure_date: string;
    created_at: string;
}

// ========== طلبات إنشاء الحجز ==========
export interface ReservationRequest {
    post_id: string;       // UUID of the post
    arrival_date: string;   // YYYY-MM-DD
    departure_date: string; // YYYY-MM-DD
}

// ========== أنواع المستخدم ==========
export interface User {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    phone_number?: string;
    date_of_birth?: string;
    location?: string;
    rating: number;
    num_reviews: number;
    num_nooks: number;
    num_reservations: number;
    join_date: string;
    profile_picture?: string;
    role?: "user" | "owner" | "admin";
}

export interface UserProfile extends User {
    posts_by_city: Record<string, any[]>;
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
    tokens?: {
        access: string;
        refresh: string;
    };
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
    location?: string;
    wilaya?: string;
    price: number;
    rating?: number;
    image?: string;
    images?: string[];
    description?: string;
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
    ownerId?: number;
    status: "reserved" | "available";
    tenant?: {
        name: string;
        mobile: string;
        email: string;
    };
    createdAt?: string;
    updatedAt?: string;
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

// ========== Search Types ==========
export interface TypeOfPeople {
    Families: boolean;
    Couple: boolean;
    Single: boolean;
}

export interface SearchCriteria {
    house_type?: string;
    number_of_rooms?: number;
    wilaya?: string;
    renter_rating?: number;
    post_rating?: number;
    min_price?: number;
    max_price?: number;
    features?: string[];
    allowed_people?: TypeOfPeople;
    rules?: string[];
    order_by?: "newest" | "oldest" | "price_asc" | "price_desc" | "rating_asc" | "rating_desc";
}

export interface SearchResult {
    renter_name: string;
    wilaya?: string;
    price: number;
    rating: number;
    description: string;
    phone_number?: string;
    contact: string;
    creation_time: string;
    picture: string;
    id?: string; // Optional post ID for navigation
}