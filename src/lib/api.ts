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
  // Allow a longer default timeout since some endpoints (like NLP load analysis)
  // may take longer on the backend. Can be overridden per-request.
  timeout: parseInt(import.meta.env.VITE_HTTP_TIMEOUT_MS || '45000'),
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

// Public helpers to derive user id from JWT
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.sub || null;
};

export const getUserIdFromStoredToken = (): string | null => {
  const token = getStoredToken();
  if (!token) return null;
  const payload = decodeJWT(token);
  return payload?.sub || payload?.email || null;
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

// Refresh token function (no-op unless VITE_TOKEN_REFRESH_ENDPOINT is configured)
const refreshToken = async (): Promise<string | null> => {
  try {
    const currentToken = getStoredToken();
    if (!currentToken) return null;

  const refreshEndpoint = (import.meta.env.VITE_TOKEN_REFRESH_ENDPOINT || '').trim();
  if (!refreshEndpoint) {
    // No refresh endpoint configured; skip silently
    return null;
  }
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
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Token expiring soon, attempting refresh...');
      }
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

// -------------------------------
// Domain-specific API helpers
// -------------------------------

export interface SaveQuestionAndAnswersParams {
  user_id: string | number;
  prompt: string;
  answers: string[];
}

export interface SaveQAResponse {
  message?: string;
  nlp_id?: string; // FastAPI may return this id for the saved NLP entry
  id?: string;     // or `id` depending on implementation
  [key: string]: unknown;
}

/**
 * Calls the backend to generate clarification prompts for a freeform text input.
 * The endpoint can be configured via VITE_SOLAR_CLARIFY_ENDPOINT. Defaults to '/clarify'.
 */
export const solarClarify = async (text: string): Promise<string[]> => {
  // Default to FastAPI route shown in your docs
  const endpoint = import.meta.env.VITE_SOLAR_CLARIFY_ENDPOINT || '/solar/clarify';
  const payload = { prompt: text };

  const response = await api.post(endpoint, payload);

  // Accept a few common response shapes
  const data = response?.data;
  const clarifications =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.clarifications) && data?.clarifications) ||
    (Array.isArray(data?.data) && data?.data) ||
    [];

  return clarifications as string[];
};

/**
 * Persists the user's prompt and the derived clarifications.
 * The endpoint can be configured via VITE_SAVE_QA_ENDPOINT. Defaults to '/question_ans_save'.
 */
export const saveQuestionAndAnswers = async (
  params: SaveQuestionAndAnswersParams
): Promise<SaveQAResponse> => {
  const endpoint = import.meta.env.VITE_SAVE_QA_ENDPOINT || '/question_ans_save';

  // Normalize payload to ensure valid JSON and match FastAPI schema
  const payload: SaveQuestionAndAnswersParams = {
    user_id: typeof params.user_id === 'number' ? String(params.user_id) : String(params.user_id),
    prompt: String(params.prompt || '').trim(),
    answers: (params.answers || []).map((a) => String(a).trim()),
  };

  if (!payload.prompt) {
    throw new Error('Prompt is required');
  }
  if (!Array.isArray(payload.answers) || payload.answers.length === 0) {
    throw new Error('At least one answer is required');
  }

  if (import.meta.env.DEV) {
    try {
      // Validate that payload is serializable JSON prior to sending
      JSON.stringify(payload);
      // eslint-disable-next-line no-console
      console.debug('POST', endpoint, 'payload →', payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid payload for saveQuestionAndAnswers:', e);
    }
  }

  try {
    const response = await api.post(endpoint, payload);
    return response.data as SaveQAResponse;
  } catch (err: any) {
    const serverMessage = err?.response?.data || err?.message || 'Request failed';
    // eslint-disable-next-line no-console
    console.error('saveQuestionAndAnswers → server error:', serverMessage);
    throw err;
  }
};

export default api;

// -------------------------------
// NLP Load Analysis helpers
// -------------------------------

export interface LoadAnalysisParams {
  user_id: string;
  nlp_id: string;
}

export interface LoadAnalysisResponse {
  status?: string;
  message?: string;
  load_id?: string;
  [key: string]: unknown;
}

export const runLoadAnalysis = async (
  params: LoadAnalysisParams
): Promise<LoadAnalysisResponse> => {
  const endpoint = import.meta.env.VITE_NLP_LOAD_ANALYSIS_ENDPOINT || '/nlp/load_analysis';

  const payload: LoadAnalysisParams = {
    user_id: String(params.user_id),
    nlp_id: String(params.nlp_id),
  };

  if (import.meta.env.DEV) {
    try {
      JSON.stringify(payload);
      // eslint-disable-next-line no-console
      console.debug('POST', endpoint, 'payload →', payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid payload for runLoadAnalysis:', e);
    }
  }

  // Give this call extra time since the server may perform NLP + DB aggregation
  const response = await api.post(endpoint, payload, {
    timeout: parseInt(import.meta.env.VITE_LOAD_ANALYSIS_TIMEOUT_MS || '90000'),
  });
  return response.data as LoadAnalysisResponse;
};

export interface GetLoadAnalysisParams {
  user_id: string;
  load_id: string;
}

export const getLoadAnalysis = async (
  params: GetLoadAnalysisParams
): Promise<unknown> => {
  const base = import.meta.env.VITE_NLP_LOAD_ANALYSIS_GET_BASE || '/nlp/load_analysis';
  // Build an absolute URL so we definitely hit the FastAPI host even when a proxy is configured
  const url = `${getApiBaseUrl()}${base}/${encodeURIComponent(params.user_id)}/${encodeURIComponent(params.load_id)}`;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('GET', url);
  }

  // Use absolute URL; axios will ignore baseURL when provided an absolute URL
  const response = await api.get(url, {
    timeout: parseInt(import.meta.env.VITE_LOAD_ANALYSIS_TIMEOUT_MS || '60000'),
  });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('GET response', url, response.data);
  }
  return response.data;
};