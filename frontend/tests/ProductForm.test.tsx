import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import ProductForm from '../src/components/ProductForm';

describe('ProductForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductForm
        title="New product"
        subtitle="Create a product"
        submitLabel="Save Product"
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Save Product' }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Price is required')).toBeInTheDocument();
    expect(screen.getByText('Stock quantity is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls the callback with the correct data on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductForm
        title="New product"
        subtitle="Create a product"
        submitLabel="Save Product"
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText('Name'), 'Scanner');
    await user.type(screen.getByLabelText('Description'), 'Warehouse scanner');
    await user.type(screen.getByLabelText('Price'), '199.9');
    await user.type(screen.getByLabelText('Stock Quantity'), '5');
    await user.click(screen.getByRole('button', { name: 'Save Product' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Scanner',
      description: 'Warehouse scanner',
      price: 199.9,
      stockQuantity: 5
    });
  });
});
