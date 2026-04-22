import type {
  ApiError,
  ApiSuccess,
  AuthPayload,
  CreateProductDTO,
  Product,
  UpdateProductDTO
} from '../types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'inventory_token';

export class ApiClientError extends Error {
  status: number;
  details: string[];

  constructor(payload: ApiError, status: number) {
    super(payload.error);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = payload.details ?? [];
  }
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
  if (response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
};

const request = async <T>(endpoint: string, init: RequestInit = {}): Promise<ApiSuccess<T>> => {
  const headers = new Headers(init.headers);
  const token = getStoredToken();
  const isJsonBody = init.body && !(init.body instanceof FormData);

  if (isJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers
  });
  const payload = await parseJson<ApiSuccess<T> | ApiError>(response);

  if (!response.ok) {
    throw new ApiClientError(payload as ApiError, response.status);
  }

  if (payload) {
    return payload as ApiSuccess<T>;
  }

  return {
    data: undefined as T,
    message: 'No content'
  };
};

export const storageKeys = {
  token: TOKEN_STORAGE_KEY,
  user: 'inventory_user'
};

export const api = {
  login: (email: string, password: string) =>
    request<AuthPayload>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getProducts: () => request<Product[]>('/api/products'),
  getProduct: (id: number) => request<Product>(`/api/products/${id}`),
  createProduct: (payload: CreateProductDTO) =>
    request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateProduct: (id: number, payload: UpdateProductDTO) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deleteProduct: (id: number) =>
    request<void>(`/api/products/${id}`, {
      method: 'DELETE'
    })
};
