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
