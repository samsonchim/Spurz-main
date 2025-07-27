// API Configuration
export const API_CONFIG = {
  // Change this when you deploy to production
  BASE_URL: __DEV__ ? 'https://6f81e3710c41.ngrok-free.app' : 'https://6f81e3710c41.ngrok-free.app',
  API_VERSION: 'v1',
  TIMEOUT: 10000, // 10 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  VERIFY_EMAIL: '/api/auth/verify-email',
  RESEND_VERIFICATION: '/api/auth/resend-verification',
  
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_SEARCH: '/api/products/search',
  
  // User endpoints
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_HISTORY: '/api/orders/history',
  
  // Other endpoints
  HEALTH: '/health',
  TEST: '/api/test',
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Request headers
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
