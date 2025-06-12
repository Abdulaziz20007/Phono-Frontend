export interface UserProfile {
  id: number;
  name: string;
  surname: string;
  phone: string;
  avatar?: string | null;
  balance: number;
  currency_id: number;
  is_active: boolean;

  emails: UserRegisteredEmail[];
  additional_phones: UserAdditionalPhone[];
  addresses: UserAddress[];

  usernameForDisplay: string;
  dob?: string | null;
  appLanguage: "ru" | "en" | "uz";
}

export interface UserAdditionalPhone {
  id: number;
  phone: string;
  user_id: number;
}

export interface UserRegisteredEmail {
  id: number;
  user_id: number;
  email: string;
  is_active: boolean;
}

export interface UserAddress {
  id: number;
  name: string;
  address: string;
  lat: string;
  long: string;
  user_id: number;
  region_id: number;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  condition: "Новый" | "Б/У";
  memory: string;
  price: number;
  currency: string;
  isFavorite: boolean;
  tags?: string[];
  status: "active" | "waiting" | "deactive";
  is_archived: boolean;
  is_checked: boolean;
  is_sold: boolean;
}

export type ActiveProfileTab = "ads" | "messages" | "favorites" | "settings";

export type ProductStatusTab = "active" | "waiting" | "deactive" | "all";
