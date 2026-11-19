import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Normalizar URL: quitar barras al final y asegurar que termine en /api
const cleanUrl = rawBaseUrl.replace(/\/+$/, '');
const baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techmateai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('techmateai_token');
      localStorage.removeItem('techmateai_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción.', {
        id: 'forbidden-action',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
