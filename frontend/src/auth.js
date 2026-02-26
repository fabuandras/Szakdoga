import axiosBase from './api/axios';
import axios from 'axios';

export function getCsrf() {
  return axios.get('/sanctum/csrf-cookie', { withCredentials: true });
}

export async function register(data) {
  await getCsrf();
  return axiosBase.post('/register', data);
}

export async function login(email, password) {
  await getCsrf();
  return axiosBase.post('/login', { email, password });
}

export async function logout() {
  return axiosBase.post('/logout');
}

export async function fetchUser() {
  return axiosBase.get('/user');
}
