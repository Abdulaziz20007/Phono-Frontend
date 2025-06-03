export interface RegisterPayload {
  phone: string;
  password: string;
  name: string;
  surname: string;
}

export interface RegisterResponse {
  uuid: string;
  expire: string;
  phone: string;
}

export interface VerifyOTPPayload {
  otp: string;
  uuid: string;
  phone: string;
  expire: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface UserProfile {
  id: number;
  name: string;
  surname: string;
  phone: string;
  avatar: string | null;
  balance: number;
  currency_id: number;
  is_active: boolean;
  dob?: string | null; // Add date of birth field
  addresses: any[];
  additional_phones: {
    id: number;
    phone: string;
    user_id: number;
  }[];
  emails: any[];
  favourite_items: any[];
  payments: any[];
  products: any[];
  comments: any[];
  blocks: any[];
}

export interface ProductImage {
  id: number;
  url: string;
  product_id: number;
  is_main: boolean;
}

export interface ProductBrand {
  id: number;
  name: string;
  logo: string;
}

export interface ProductModel {
  id: number;
  name: string;
  brand_id: number;
}

export interface ProductUser {
  id: number;
  name: string;
  surname: string;
  phone: string;
  password?: string;
  avatar: string | null;
  balance: number;
  currency_id: number;
  is_active: boolean;
  refresh_token: string | null;
  addresses?: {
    id: number;
    address: string;
    lat?: string;
    long?: string;
  }[];
  products?: {
    id: number;
    title: string;
    images?: { id: number; url: string }[];
  }[];
  additional_phones?: {
    id: number;
    phone: string;
  }[];
}

export interface Product {
  id: number;
  user_id: number;
  title: string;
  description: string;
  year: number;
  brand_id: number;
  model_id: number;
  custom_model: string | null;
  color_id: number;
  price: number;
  floor_price: boolean;
  currency_id: number;
  is_new: boolean;
  has_document: boolean;
  address_id: number;
  phone_id: number;
  storage: number;
  ram: number;
  views: number;
  is_archived: boolean;
  is_sold: boolean;
  is_checked: boolean;
  admin_id: number | null;
  top_expire_date: string;
  images?: ProductImage[];
  brand?: ProductBrand;
  model?: ProductModel;
  user?: ProductUser;
}

export interface Model {
  id: number;
  name: string;
  brand_id: number;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  models: Model[];
}

export interface HomepageData {
  products: Product[];
  brands: Brand[];
}
