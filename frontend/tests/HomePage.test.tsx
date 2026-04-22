import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { ProductContext } from '../src/context/ProductContext';
import HomePage from '../src/pages/HomePage';
import type { Product, ProductContextType } from '../src/types';

const product: Product = {
  id: 1,
  name: 'Scanner',
  description: 'Warehouse scanner',
  price: 199.9,
  stockQuantity: 3,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z'
};

const createContextValue = (
  overrides: Partial<ProductContextType> = {}
): ProductContextType => ({
  products: [product],
  loading: false,
  error: null,
  fetchProducts: vi.fn().mockResolvedValue(undefined),
  addProduct: vi.fn().mockResolvedValue(undefined),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  ...overrides
});

describe('HomePage', () => {
  it('loads products and deletes one from the inventory table', async () => {
    const user = userEvent.setup();
    const fetchProducts = vi.fn().mockResolvedValue(undefined);
    const deleteProduct = vi.fn().mockResolvedValue(undefined);
    const contextValue = createContextValue({
      fetchProducts,
      deleteProduct
    });

    render(
      <MemoryRouter>
        <ProductContext.Provider value={contextValue}>
          <HomePage />
        </ProductContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Remove Scanner from the catalog?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Product' }));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText('Scanner deleted successfully.')).toBeInTheDocument();
  });
});
