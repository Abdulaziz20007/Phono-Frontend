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
} from "./types";

// Determine if we're running on the client side
const isBrowser = typeof window !== "undefined";

// Use absolute URL to ensure direct client-side API calls
const BASE_URL = "https://api.phono.ligma.uz";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add a request interceptor to include auth token when available
axiosInstance.interceptors.request.use(
  (config) => {
    // Only access localStorage in the browser
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

// Simplified export of API methods
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
    me: async (token: string): Promise<UserProfile> => {
      try {
        // Override the authorization header for this specific request
        const response = await axiosInstance.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
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
        const response = await axiosInstance.put("/user/profile", data);
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
        const response = await axiosInstance.get("/user/favorites");
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
        const response = await axiosInstance.post(
          `/user/favorites/toggle/${productId}`
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

    addPhoneNumber: async (
      phone: string
    ): Promise<{ id: number; phone: string; user_id: number }> => {
      try {
        const response = await axiosInstance.post("/user/phones", { phone });
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
        const response = await axiosInstance.delete(`/user/phones/${phoneId}`);
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
      id: number;
      email: string;
      user_id: number;
      is_active: boolean;
    }> => {
      try {
        const response = await axiosInstance.post("/user/emails", { email });
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
        const response = await axiosInstance.delete(`/user/emails/${emailId}`);
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
        const response = await axiosInstance.post(
          "/user/addresses",
          addressData
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

    deleteAddress: async (addressId: number): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.delete(
          `/user/addresses/${addressId}`
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

    changeLanguage: async (
      language: "ru" | "en" | "uz"
    ): Promise<{ success: boolean }> => {
      try {
        const response = await axiosInstance.put("/user/language", {
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
};

// Re-export types for convenience
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
};
