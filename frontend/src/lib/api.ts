import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://secure-formulation-backend-production.up.railway.app',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // If no NEXT_PUBLIC_API_URL is baked in, dynamically route localhost requests locally
    if (!process.env.NEXT_PUBLIC_API_URL) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        config.baseURL = 'http://localhost:3001';
      } else {
        config.baseURL = 'https://secure-formulation-backend-production.up.railway.app';
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

