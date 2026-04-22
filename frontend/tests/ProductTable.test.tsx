import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ProductTable from '../src/components/ProductTable';

describe('ProductTable', () => {
  it('renders the product list correctly', () => {
    render(
      <MemoryRouter>
        <ProductTable
          products={[
            {
              id: 1,
              name: 'Scanner',
              description: 'Warehouse scanner',
              price: 199.9,
              stockQuantity: 3,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-02T00:00:00.000Z'
            }
          ]}
          onDeleteRequest={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Scanner')).toBeInTheDocument();
    expect(screen.getByText('Warehouse scanner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders an empty state with no products', () => {
    render(
      <MemoryRouter>
        <ProductTable products={[]} onDeleteRequest={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('No products yet.')).toBeInTheDocument();
  });
});
