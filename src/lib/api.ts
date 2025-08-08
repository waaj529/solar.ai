import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Type definitions for token payload
interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  email?: string;
}

// Storage utility based on environment variable
class TokenStorage {
  private storageType: 'localStorage' | 'sessionStorage' | 'memory';
  private memoryStore: Map<string, string> = new Map();

  constructor() {
    this.storageType = (import.meta.env.VITE_TOKEN_STORAGE as 'localStorage' | 'sessionStorage' | 'memory') || 'localStorage';
  }

  setItem(key: string, value: string): void {
    switch (this.storageType) {
      case 'localStorage':
        localStorage.setItem(key, value);
        break;
      case 'sessionStorage':
        sessionStorage.setItem(key, value);
        break;
      case 'memory':
        this.memoryStore.set(key, value);
        break;
    }
  }

  getItem(key: string): string | null {
    switch (this.storageType) {
      case 'localStorage':
        return localStorage.getItem(key);
      case 'sessionStorage':
        return sessionStorage.getItem(key);
      case 'memory':
        return this.memoryStore.get(key) || null;
      default:
        return null;
    }
  }

  removeItem(key: string): void {
    switch (this.storageType) {
      case 'localStorage':
        localStorage.removeItem(key);
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(key);
        break;
      case 'memory':
        this.memoryStore.delete(key);
        break;
    }
  }

  clear(): void {
    switch (this.storageType) {
      case 'localStorage':
        localStorage.clear();
        break;
      case 'sessionStorage':
        sessionStorage.clear();
        break;
      case 'memory':
        this.memoryStore.clear();
        break;
    }
  }
}

const tokenStorage = new TokenStorage();

// Create axios instance with base configuration
const getApiBaseUrl = () => {
  // Default to '/api' so production uses platform proxy (e.g., Netlify) and
  // development falls back to direct backend connection below.
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

  // If we're in development and using relative path, use direct HTTP connection
  if (import.meta.env.DEV && baseUrl === '/api') {
    return 'http://75.119.151.238:5001';
  }

  return baseUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout for better error handling
  timeout: 15000, // Increased timeout for proxy requests
});

// Token management utilities
export const getStoredToken = (): string | null => {
  return tokenStorage.getItem('auth_token');
};

export const setStoredToken = (token: string): void => {
  tokenStorage.setItem('auth_token', token);
};

export const removeStoredToken = (): void => {
  tokenStorage.removeItem('auth_token');
};

// JWT decode utility (simple base64 decode)
const decodeJWT = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Check if token is expired or will expire soon
const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const refreshBuffer = parseInt(import.meta.env.VITE_TOKEN_REFRESH_BUFFER || '30');
  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;
  
  return timeUntilExpiry <= refreshBuffer * 1000; // Refresh if expiring within buffer time
};

// Refresh token function
const refreshToken = async (): Promise<string | null> => {
  try {
    const currentToken = getStoredToken();
    if (!currentToken) return null;

  const refreshEndpoint = import.meta.env.VITE_TOKEN_REFRESH_ENDPOINT || '/refresh';
  // Use resolved base URL for refresh to work in both dev and production
  const response = await axios.post(`${getApiBaseUrl()}${refreshEndpoint}`, {}, {
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.access_token || response.data.token) {
      const newToken = response.data.access_token || response.data.token;
      setStoredToken(newToken);
      return newToken;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Request interceptor to add auth token and handle refresh
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getStoredToken();
    
    if (token && isTokenExpired(token)) {
      console.log('Token expiring soon, attempting refresh...');
      const newToken = await refreshToken();
      token = newToken || token;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        // Refresh failed, redirect to login
        removeStoredToken();
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;