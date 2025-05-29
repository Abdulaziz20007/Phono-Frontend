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

const BASE_URL = "http://localhost:3000";

// Default fetch options to apply to all requests
const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials, // Important for cookies/authentication
};

// Helper to add authorization header when needed
const withAuth = (token: string) => ({
  ...defaultOptions,
  headers: {
    ...defaultOptions.headers,
    Authorization: `Bearer ${token}`,
  },
});

// Helper for error handling
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (parseError) {
      // If the error response isn't valid JSON
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
  }

  return response.json();
};

export const api = {
  auth: {
    register: async (userData: RegisterPayload): Promise<RegisterResponse> => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(userData),
      });

      return handleApiResponse(response);
    },

    verifyOTP: async (
      verificationData: VerifyOTPPayload
    ): Promise<TokenResponse> => {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(verificationData),
      });

      return handleApiResponse(response);
    },

    login: async (credentials: LoginPayload): Promise<TokenResponse> => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(credentials),
      });

      return handleApiResponse(response);
    },

    refreshToken: async (): Promise<TokenResponse> => {
      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        ...defaultOptions,
      });

      return handleApiResponse(response);
    },

    logout: async (): Promise<void> => {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        ...defaultOptions,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Logout failed");
      }
    },
  },
  user: {
    me: async (token: string): Promise<UserProfile> => {
      const response = await fetch(`${BASE_URL}/user/me`, {
        method: "GET",
        ...withAuth(token),
      });

      return handleApiResponse(response);
    },
  },
  home: {
    getData: async (): Promise<HomepageData> => {
      const response = await fetch(`${BASE_URL}/web`, {
        method: "GET",
        ...defaultOptions,
      });

      return handleApiResponse(response);
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
