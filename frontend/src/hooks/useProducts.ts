import { useContext } from 'react';

import { ProductContext } from '../context/ProductContext';
import type { ProductContextType } from '../types';

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }

  return context;
};
