import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://task-eaii.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
