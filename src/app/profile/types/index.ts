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
  email: string;
  user_id: number;
  is_active: boolean;
}

// Siz bergan Prisma schemasiga mos
export interface UserAddress {
  id: number;
  name: string; // UI'da "Дом", "Офис" uchun
  address: string;
  lat?: string | null; // Prisma'da String, null bo'lishi mumkin
  long?: string | null; // Prisma'da String, null bo'lishi mumkin
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
}

export type ActiveProfileTab = "ads" | "messages" | "favorites" | "settings";
