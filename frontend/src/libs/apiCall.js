import axios from 'axios';
import useStore from '../store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
});

export function setAuthToken(token) {
  if(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }else{
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
