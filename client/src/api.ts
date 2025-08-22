import axios from 'axios';
import type { User, UserCreate, UserUpdate, List, ListCreate, ListUpdate, Task, TaskCreate, TaskUpdate } from './types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  getAll: () => api.get<User[]>('/users/'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: UserCreate) => api.post<User>('/users/', user),
  update: (id: number, user: UserUpdate) => api.put<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// List API
export const listAPI = {
  getAll: () => api.get<List[]>('/lists/'),
  getById: (id: number) => api.get<List>(`/lists/${id}`),
  create: (list: ListCreate) => api.post<List>('/lists/', list),
  update: (id: number, list: ListUpdate) => api.put<List>(`/lists/${id}`, list),
  delete: (id: number) => api.delete(`/lists/${id}`),
};

// Task API
export const taskAPI = {
  getAll: () => api.get<Task[]>('/tasks/'),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (task: TaskCreate) => api.post<Task>('/tasks/', task),
  update: (id: number, task: TaskUpdate) => api.put<Task>(`/tasks/${id}`, task),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};