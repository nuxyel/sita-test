import {
  createContext,
  useState,
  type PropsWithChildren
} from 'react';

import { api, storageKeys } from '../services/api';
import type { AuthContextType, User } from '../types';

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem(storageKeys.user);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
};

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(storageKeys.token);
};

const persistAuth = (token: string, user: User): void => {
  window.localStorage.setItem(storageKeys.token, token);
  window.localStorage.setItem(storageKeys.user, JSON.stringify(user));
};

const clearStoredAuth = (): void => {
  window.localStorage.removeItem(storageKeys.token);
  window.localStorage.removeItem(storageKeys.user);
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.login(email, password);

    persistAuth(response.data.token, response.data.user);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const logout = (): void => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(token)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
