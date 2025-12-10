import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  User,
} from "../types/auth";

// Create axios instance
// Determine API base URL:
// - In production set VITE_API_URL (e.g. https://api.example.com)
// - In development we use the Vite proxy at `/api`
const apiBase = (import.meta.env && import.meta.env.VITE_API_URL)
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store access token in memory
let accessToken: string | null = null;
let refreshTokenPromise: Promise<string> | null = null;

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Set access token in memory
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Get access token from memory
export const getAccessToken = (): string | null => {
  return accessToken;
};

// Set refresh token in localStorage
export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

// Clear all tokens
export const clearTokens = () => {
  accessToken = null;
  setRefreshToken(null);
};

// Refresh access token (use plain axios to avoid interceptor loop)
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    // Use plain axios to avoid interceptor recursion
    // In development, Vite proxy handles /api
    // In production, use environment variable or same origin
    const apiURL = import.meta.env.VITE_API_URL || window.location.origin;
    const response = await axios.post<RefreshResponse>(
      `${apiURL}/api/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newAccessToken = response.data.accessToken;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If we're already refreshing, wait for that promise
      if (refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch {
          // Refresh failed, will be handled below
        }
      } else {
        // Start refresh process
        refreshTokenPromise = refreshAccessToken();

        try {
          const newToken = await refreshTokenPromise;
          refreshTokenPromise = null;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          refreshTokenPromise = null;
          clearTokens();
          // Redirect to login will be handled by the component
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/user/profile");
    return response.data;
  },
};

export default api;
