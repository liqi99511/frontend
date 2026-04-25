import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用户相关 API
export const userApi = {
  getUsers: (params: { page: number; pageSize: number }) =>
    api.get('/user/users', { params }),
  getUserById: (id: number) =>
    api.get(`/user/users/${id}`),
  addUser: (data: any) =>
    api.post('/user/add', data),
  updateUser: (id: number, data: any) =>
    api.put(`/user/users/${id}`, data),
  deleteUser: (id: number) =>
    api.delete(`/user/users/${id}`),
  searchUsers: (name: string) =>
    api.get('/user/search', { params: { name } }),
};

// 排便记录相关 API
export const bowelRecordApi = {
  addRecord: (data: any) =>
    api.post('/bowel-record/add', data),
  getHistory: (params: { userId: number; page?: number; pageSize?: number }) =>
    api.get('/bowel-record/history', { params }),
  getById: (id: number) =>
    api.get(`/bowel-record/${id}`),
  deleteRecord: (id: number) =>
    api.delete(`/bowel-record/${id}`),
};

export default api;
