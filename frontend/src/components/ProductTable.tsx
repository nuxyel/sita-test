import { Link } from 'react-router-dom';

import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onDeleteRequest: (product: Product) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const ProductTable = ({ products, onDeleteRequest }: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <p className="empty-state__eyebrow">No products yet</p>
        <h2>No products yet.</h2>
        <p>Add a product to get started.</p>
      </section>
    );
  }

  return (
    <div className="table-shell">
      <table className="inventory-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="table-primary">
                  <span>{product.name}</span>
                  <small>Updated {new Date(product.updatedAt).toLocaleDateString()}</small>
                </div>
              </td>
              <td>{product.description}</td>
              <td>{currencyFormatter.format(product.price)}</td>
              <td>{product.stockQuantity}</td>
              <td>
                <div className="row-actions">
                  <Link to={`/products/${product.id}/edit`} className="button button--ghost button--small">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="button button--small button--danger-outline"
                    onClick={() => onDeleteRequest(product)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
