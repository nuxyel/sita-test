import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import DeleteDialog from '../src/components/DeleteDialog';

describe('DeleteDialog', () => {
  it('renders the confirmation message', () => {
    render(
      <DeleteDialog
        open
        productName="Scanner"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Remove Scanner from the catalog?')).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteDialog
        open
        productName="Scanner"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Delete Product' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
