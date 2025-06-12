// app/profile/types/index.ts
export interface UserProfile {
  id: number;
  name: string;
  surname: string;
  phone: string; // Asosiy telefon raqami (tahrirlanmasligi mumkin yoki alohida logika)
  avatar?: string | null; // Rasm URL'i
  balance: number; // Prisma'da Float
  // currency_id: number; // Kerak bo'lsa, UI'da valyutani ko'rsatish uchun
  // is_active: boolean; // UI'da kerak bo'lmasligi mumkin

  // Qo'shimcha ma'lumotlar (relations)
  emails: UserRegisteredEmail[]; // Prisma'dan `emails`
  additional_phones: UserAdditionalPhone[]; // Prisma'dan `additional_phones`
  addresses: UserAddress[]; // Prisma'dan `addresses`

  // Bizning UI'miz uchun qo'shimcha maydonlar (Prisma'da yo'q, lekin frontend logikasi uchun)
  usernameForDisplay: string; // Masalan, "Rochel_123" kabi ko'rsatiladigan nom
  dob?: string | null; // Tug'ilgan kun (YYYY-MM-DD formatida, Prisma'da alohida yo'q)
  appLanguage: "ru" | "en" | "uz"; // Ilova tili
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

// update to match prisma schema where lat and long are non-nullable strings
export interface UserAddress {
  id: number;
  name: string; // UI'da "Дом", "Офис" uchun
  address: string;
  lat: string; // non-nullable string per prisma schema
  long: string; // non-nullable string per prisma schema
  user_id: number;
}

export interface Ad {
  id: string; // Yoki number, agar backend'dan kelsa
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
