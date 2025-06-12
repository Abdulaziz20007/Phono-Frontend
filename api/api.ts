import axios from "axios";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
  LoginPayload,
  TokenResponse,
  UserProfile,
  Product,
  Model,
  Brand,
  HomepageData,
  Comment,
  ProductImage,
} from "./types";

export interface Color {
  id: number;
  name: string;
  hex: string;
}

export interface Region {
  id: number;
  name: string;
  cities?: City[];
}

export interface City {
  id: number;
  name: string;
  region_id: number;
}

export interface Address {
  id: number;
  address: string;
  lat: string;
  long: string;
}

export interface Phone {
  id: number;
  phone: string;
}

export interface UserProduct {
  id: number;
  title: string;
  images: ProductImage[];
}

export interface ApiResponse {
  products: Product[];
  brands: Brand[];
  colors: Color[];
  regions: Region[];
}

const isBrowser = typeof window !== "undefined";

const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://api.phono.ligma.uz";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    register: async (userData: RegisterPayload): Promise<RegisterResponse> => {
      try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    verifyOTP: async (
      verificationData: VerifyOTPPayload
    ): Promise<TokenResponse> => {
      try {
        const response = await axiosInstance.post(
          "/auth/verify-otp",
          verificationData
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    login: async (credentials: LoginPayload): Promise<TokenResponse> => {
      try {
        const response = await axiosInstance.post("/auth/login", credentials);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    refreshToken: async (): Promise<TokenResponse> => {
      try {
        const response = await axiosInstance.post("/auth/refresh-token");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    logout: async (): Promise<void> => {
      try {
        await axiosInstance.post("/auth/logout");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || "Logout failed");
        }
        throw new Error("Network error occurred");
      }
    },
  },

  user: {
    me: async (token?: string): Promise<UserProfile> => {
      try {
        if (token) {
          const response = await axiosInstance.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
        }
        const response = await axiosInstance.get("/user/me");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getProfile: async (): Promise<UserProfile> => {
      try {
        const response = await axiosInstance.get("/user/me");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      try {
        const response = await axiosInstance.patch("/user/profile", data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getUserAds: async (): Promise<Product[]> => {
      try {
        const response = await axiosInstance.get("/user/ads");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getFavorites: async (): Promise<Product[]> => {
      try {
        const response = await axiosInstance.get("/favourite-item");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addFavorite: async (productId: number): Promise<any> => {
      try {
        const response = await axiosInstance.post("/favourite-item/user/add", {
          product_id: productId,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    removeFavorite: async (productId: number): Promise<any> => {
      try {
        const response = await axiosInstance.delete(
          `/favourite-item/user/product/${productId}`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    toggleFavorite: async (
      productId: number
    ): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(
          `/favourite-item/user/product/${productId}`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addToFavorites: async (
      productId: number
    ): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.post(`/favourite-item`, {
          product_id: productId,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (
            error.response.data.message === "Mahsulot allaqachon sevimlilarda"
          ) {
            return { success: true };
          }
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getFavouriteItems: async (): Promise<Product[]> => {
      try {
        const response = await axiosInstance.get("/user/favouriteItem");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addPhoneNumber: async (
      phone: string
    ): Promise<{ id: number; phone: string; user_id: number }> => {
      try {
        let formattedPhone = phone;
        if (phone.startsWith("+998")) {
          formattedPhone = phone.substring(4).replace(/\s/g, "");
        }

        const response = await axiosInstance.post("/phone", {
          phone: formattedPhone,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    deletePhoneNumber: async (
      phoneId: number
    ): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(`/phone/${phoneId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addEmail: async (
      email: string
    ): Promise<{
      user_id: number;
      email: string;
      is_active: boolean;
    }> => {
      try {
        const response = await axiosInstance.post("/email", { email });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    deleteEmail: async (emailId: number): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(`/email/${emailId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    editEmail: async (
      emailId: number,
      newEmail: string
    ): Promise<{
      id: number;
      user_id: number;
      email: string;
      is_active: boolean;
    }> => {
      try {
        const response = await axiosInstance.patch(`/email/${emailId}`, {
          email: newEmail,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addAddress: async (addressData: {
      name: string;
      address: string;
      lat?: string;
      long?: string;
    }): Promise<{
      id: number;
      name: string;
      address: string;
      lat: string | null;
      long: string | null;
      user_id: number;
    }> => {
      try {
        const response = await axiosInstance.post("/address", addressData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    deleteAddress: async (addressId: number): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(`/address/${addressId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    changeLanguage: async (
      language: "ru" | "en" | "uz"
    ): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.patch("/user/language", {
          language,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    deleteAccount: async (): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete("/user/account");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },
  },

  product: {
    getAll: async (limit?: number): Promise<Product[]> => {
      try {
        const url = limit ? `/product?limit=${limit}` : "/product";
        const response = await axiosInstance.get(url);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getById: async (id: string | number): Promise<Product> => {
      try {
        const response = await axiosInstance.get(`/product/${id}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getByBrand: async (brandId: number): Promise<Product[]> => {
      try {
        const response = await axiosInstance.get(`/product/brand/${brandId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getByModel: async (modelId: number): Promise<Product[]> => {
      try {
        const response = await axiosInstance.get(`/product/model/${modelId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    create: async (productData: any): Promise<any> => {
      try {
        const response = await axiosInstance.post("/product", productData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    update: async (productId: number, productData: any): Promise<any> => {
      try {
        const response = await axiosInstance.patch(
          `/product/${productId}`,
          productData
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    uploadImage: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    uploadProductImage: async (
      productId: number,
      imageFile: File,
      isMain: boolean = false
    ): Promise<any> => {
      try {
        const formData = new FormData();
        formData.append("product_id", productId.toString());
        formData.append("is_main", isMain.toString());
        formData.append("images", imageFile);

        const response = await axiosInstance.post("/product-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    search: async (params: {
      search: string;
      top?: boolean;
      region_id?: number;
      category_id?: number;
      brand_id?: number;
      color_id?: number;
      price_from?: number;
      price_to?: number;
      memory_from?: number;
      memory_to?: number;
      ram_from?: number;
      ram_to?: number;
    }): Promise<Product[]> => {
      try {
        const searchParams = {
          ...params,
          search: params.search || "",
        };

        const response = await axiosInstance.post(
          "/product/search",
          searchParams
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    getSimilar: async (
      brandId: number,
      modelId: number
    ): Promise<Product[]> => {
      try {
        const modelResponse = await axiosInstance.get(
          `/product/model/${modelId}`
        );
        if (modelResponse.data && modelResponse.data.length > 0) {
          return modelResponse.data;
        }

        const brandResponse = await axiosInstance.get(
          `/product/brand/${brandId}`
        );
        return brandResponse.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },
  },

  home: {
    getData: async (): Promise<HomepageData> => {
      try {
        const response = await axiosInstance.get("/web");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },
  },

  comment: {
    getProductComments: async (
      productId: number | string
    ): Promise<Comment[]> => {
      try {
        const response = await axiosInstance.get(
          `/comment/product/${productId}`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    addComment: async (data: {
      product_id: number;
      text: string;
    }): Promise<Comment> => {
      try {
        const response = await axiosInstance.post("/comment", data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    updateComment: async (
      commentId: number,
      text: string
    ): Promise<Comment> => {
      try {
        const response = await axiosInstance.patch(`/comment/${commentId}`, {
          text,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },

    deleteComment: async (commentId: number): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(`/comment/${commentId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(
            error.response.data.message || `API error: ${error.response.status}`
          );
        }
        throw new Error("Network error occurred");
      }
    },
  },

  regions: {},
};

export const fetchAppData = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get("/web");

    const responseData: ApiResponse = {
      products: response.data.products || [],
      brands: response.data.brands || [],
      colors: response.data.colors || [],
      regions: response.data.regions || [],
    };

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || `API error: ${error.response.status}`
      );
    }
    throw new Error("Network error occurred");
  }
};

export const fetchCitiesByRegion = async (
  regionId: number
): Promise<City[]> => {
  return [];
};

export const createProduct = async (productData: any): Promise<any> => {
  return api.product.create(productData);
};

export const updateProduct = async (
  productId: number,
  productData: any
): Promise<any> => {
  const response = await axiosInstance.patch(
    `/product/${productId}`,
    productData
  );
  return response.data;
};

export const archiveProduct = async (
  productId: number,
  isSold: boolean = false
): Promise<any> => {
  const response = await axiosInstance.patch(`/product/archive/${productId}`, {
    is_sold: isSold,
  });
  return response.data;
};

export const unarchiveProduct = async (productId: number): Promise<any> => {
  const response = await axiosInstance.patch(`/product/unarchive/${productId}`);
  return response.data;
};

export const upgradeProduct = async (productId: number): Promise<any> => {
  const response = await axiosInstance.patch(`/product/upgrade/${productId}`);
  return response.data;
};

export const getProductById = async (productId: number): Promise<Product> => {
  try {
    console.log(`Calling getProductById with ID: ${productId}`);
    const response = await axiosInstance.get(`/product/${productId}`);
    console.log(`Product data received:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in getProductById for ID ${productId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || `API error: ${error.response.status}`
      );
    }
    throw new Error("Network error occurred when fetching product");
  }
};

export const uploadProductImage = async (
  productId: number,
  file: File,
  isMain: boolean = false
): Promise<any> => {
  return api.product.uploadProductImage(productId, file, isMain);
};

export const deleteProductImage = async (
  productId: number,
  imageId: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/product-image/${imageId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || `API error: ${error.response.status}`
      );
    }
    throw new Error("Network error occurred");
  }
};

export const setMainProductImage = async (
  productId: number,
  imageId: number
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(
      `/product-image/${imageId}/set-main`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || `API error: ${error.response.status}`
      );
    }
    throw new Error("Network error occurred");
  }
};

export type {
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
  LoginPayload,
  TokenResponse,
  UserProfile,
  Product,
  Model,
  Brand,
  HomepageData,
  Comment,
};
