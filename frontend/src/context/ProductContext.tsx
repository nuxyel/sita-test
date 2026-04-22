import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react';

import { AuthContext } from './AuthContext';
import { ApiClientError, api } from '../services/api';
import type {
  CreateProductDTO,
  Product,
  ProductContextType,
  UpdateProductDTO
} from '../types';

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof ApiClientError) {
    return error.details.length > 0 ? error.details.join(' ') : error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('ProductProvider must be used within AuthProvider');
  }

  const { isAuthenticated, logout } = authContext;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      startTransition(() => {
        setProducts([]);
      });
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleMutationError = (errorValue: unknown, fallbackMessage: string): never => {
    const message =
      errorValue instanceof ApiClientError && errorValue.status === 401
        ? 'Your session expired. Please sign in again.'
        : getErrorMessage(errorValue, fallbackMessage);

    if (errorValue instanceof ApiClientError && errorValue.status === 401) {
      logout();
    }

    setError(message);
    throw new Error(message);
  };

  const fetchProducts = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getProducts();

      startTransition(() => {
        setProducts(response.data);
      });
    } catch (errorValue) {
      if (errorValue instanceof ApiClientError && errorValue.status === 401) {
        logout();
        setError('Your session expired. Please sign in again.');
      } else {
        setError(getErrorMessage(errorValue, 'Unable to load products.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data: CreateProductDTO): Promise<void> => {
    setError(null);

    try {
      const response = await api.createProduct(data);

      startTransition(() => {
        setProducts((currentProducts) => [response.data, ...currentProducts]);
      });
    } catch (errorValue) {
      handleMutationError(errorValue, 'Unable to create product.');
    }
  };

  const updateExistingProduct = async (id: number, data: UpdateProductDTO): Promise<void> => {
    setError(null);

    try {
      const response = await api.updateProduct(id, data);

      startTransition(() => {
        setProducts((currentProducts) =>
          currentProducts.map((product) => (product.id === id ? response.data : product))
        );
      });
    } catch (errorValue) {
      handleMutationError(errorValue, 'Unable to update product.');
    }
  };

  const removeProduct = async (id: number): Promise<void> => {
    setError(null);

    try {
      await api.deleteProduct(id);

      startTransition(() => {
        setProducts((currentProducts) =>
          currentProducts.filter((product) => product.id !== id)
        );
      });
    } catch (errorValue) {
      handleMutationError(errorValue, 'Unable to delete product.');
    }
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct: updateExistingProduct,
    deleteProduct: removeProduct
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
