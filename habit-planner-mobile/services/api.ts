import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Replace with your actual backend URL (e.g., from Render or local IP for dev)
// For Android Emulator, use http://10.0.2.2:5000
// For physical device, use your computer's IP address: http://192.168.x.x:5000
const BASE_URL = 'http://10.0.2.2:5000'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: any) => api.post('/api/auth/register', userData),
  login: (userData: any) => api.post('/api/auth/login', userData),
  getMe: () => api.get('/api/auth/me'),
};

export const habitsAPI = {
  getAll: (frequency?: string) => api.get(`/api/habits${frequency ? `?frequency=${frequency}` : ''}`),
  create: (habitData: any) => api.post('/api/habits', habitData),
  update: (id: string, habitData: any) => api.put(`/api/habits/${id}`, habitData),
  delete: (id: string) => api.delete(`/api/habits/${id}`),
  getById: (id: string) => api.get(`/api/habits/${id}`),
  toggleComplete: (id: string) => api.patch(`/api/habits/${id}/complete`),
  getStats: () => api.get('/api/habits/stats'),
};

export default api;
