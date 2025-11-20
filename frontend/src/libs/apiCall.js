// libs/apiCall.js
import axios from 'axios';

const DEFAULT_LOCAL = 'http://localhost:5000/api';

// Vite exposes env vars prefixed with VITE_ via import.meta.env
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || DEFAULT_LOCAL;

const api = axios.create({
  baseURL: API_BASE,
  // you can set global timeout or headers here if needed:
  // timeout: 10000,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
