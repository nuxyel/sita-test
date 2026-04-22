import type { JwtPayload } from 'jsonwebtoken';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

export interface PublicUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenPayload extends JwtPayload {
  email: string;
}

export interface ApiSuccess<T> {
  data: T;
  message: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}
