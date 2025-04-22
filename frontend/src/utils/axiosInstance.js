import axios from 'axios';

const token = localStorage.getItem('authToken');

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default axiosInstance;