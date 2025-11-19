import axios from 'axios';
import API_BASE_URL from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers['x-auth-token'] = token;
    } else if (adminToken) {
      config.headers['x-auth-token'] = adminToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
