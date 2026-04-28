// ========== Post page types ==========
export interface HouseImage {
  id: number;
  URL: string;
}

export interface SellerInfo {
  id: number;
  full_name: string;
  email: string;
  profile_picture: string;
  rating: number;
  verified: boolean;
}

export interface HouseInfo {
  Price: number;
  Surface: number;
  RoomNum: number;
  num_bedroom: number | null;
  num_bathroom: number | null;
  Types_of_Renters: string | null;
  Description: string;
}

export interface HouseLocation {
  County: string;
  State: string;
  Country: string;
  Latitude: number;
  Longitude: number;
}

export interface CommentData {
  id: string;
  user_id: number;
  rating: number;
  comment: string;
<<<<<<< Updated upstream
  commenter: {
    id: number;
    full_name: string;
    profile_picture: string | null;
  };
=======
>>>>>>> Stashed changes
  created_at: string;
  modified_at: string;
}

<<<<<<< Updated upstream
export interface HouseRules {
  allows_animals: boolean;
  allows_smoking: boolean;
  allows_noise: boolean;
}

export interface PostReservation {
  id: number;
  post_id: string;
  arrival_date: string;
  departure_date: string;
  created_at: string;
  duration_days: number;
}

=======
>>>>>>> Stashed changes
export interface PostData {
  id: string;
  title: string;
  description: string;
  status: string;
  rating: number;
  created_at: string;
  updated_at: string;
  views_count: number;
  saves_count: number;
  comments_count: number;
<<<<<<< Updated upstream
  user_rating_seller: number | null;
  user_rating_post: number | null;
=======
>>>>>>> Stashed changes
  seller: SellerInfo;
  house: HouseInfo;
  location: HouseLocation | null;
  house_pictures: HouseImage[];
  comments: CommentData[];
  comment_list?: CommentData[];
<<<<<<< Updated upstream
  features: string[];
  house_rules: HouseRules | null;
  allowed_people: string;
  reservations: PostReservation[];
=======
>>>>>>> Stashed changes
}

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
    max_renter_rating?: number;
    post_rating?: number;
    max_post_rating?: number;
    min_price?: number;
    max_price?: number;
    features?: string[];
    allowed_people?: TypeOfPeople;
    rules?: string[];
    order_by?: "newest" | "oldest" | "price_asc" | "price_desc" | "rating_asc" | "rating_desc";
}

export interface SearchResult {
    id: string;
    renter_name: string;
    wilaya?: string;
    price: number;
    rating: number;
    description: string;
    phone_number?: string;
    contact: string;
    creation_time: string;
    picture: string;
}

// ========== Public Profile Types ==========
export interface PublicNookCard {
    id: string;
    title: string;
    primary_image: string | null;
    price_per_night: number;
    rating: number;
    wilaya: string | null;
    County: string | null;
}

export interface PublicSeller {
    id: number;
    full_name: string;
    profile_picture: string | null;
    gender: string | null;
    date_of_birth: string | null;
    host_since: number;
    rating: number;
    location: string | null;
    email: string;
    mobile_number: string | null;
    reviews_count: number;
    nooks_count: number;
    reservations_count: number;
}

export interface PublicSellerProfile {
    seller: PublicSeller;
    nooks: PublicNookCard[];
}