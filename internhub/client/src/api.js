import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});
export const errMsg = (e) => e.response?.data?.message || (e.request ? 'Cannot reach the server. Check that the backend is running.' : e.message);
export default api;
