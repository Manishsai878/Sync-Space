// client/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Automatically inject session token into headers if the user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;