import axios from 'axios';
import useStore from '../store';

const api = axios.create({
  baseURL: 'https://finance-glance.onrender.com/api', // your backend base URL
});

export function setAuthToken(token) {
  if(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }else{
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
