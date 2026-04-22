export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export type UpdateProductDTO = CreateProductDTO;

export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface ApiSuccess<T> {
  data: T;
  message: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (data: CreateProductDTO) => Promise<void>;
  updateProduct: (id: number, data: UpdateProductDTO) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
}
