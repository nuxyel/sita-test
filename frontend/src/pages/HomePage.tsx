import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import DeleteDialog from '../components/DeleteDialog';
import ProductTable from '../components/ProductTable';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

interface LocationState {
  message?: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts();
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    const state = location.state as LocationState | null;

    if (state?.message) {
      setFlashMessage(state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const totalUnits = products.reduce((total, product) => total + product.stockQuantity, 0);
  const totalInventoryValue = products.reduce(
    (total, product) => total + product.stockQuantity * product.price,
    0
  );

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!productToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProduct(productToDelete.id);
      setFlashMessage(`${productToDelete.name} deleted successfully.`);
      setProductToDelete(null);
    } catch (errorValue) {
      setFlashMessage(
        errorValue instanceof Error ? errorValue.message : 'Unable to delete product.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="workspace-header">
        <div className="section-heading">
          <p className="section-heading__eyebrow">Inventory</p>
          <h1>Manage products, prices, and stock.</h1>
          <p>Use the table below to add, edit, or remove products.</p>
        </div>
        <Link to="/products/new" className="button">
          Add Product
        </Link>
      </section>

      <section className="summary-strip" aria-label="Inventory summary">
        <div>
          <span>Products</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Total Units</span>
          <strong>{totalUnits}</strong>
        </div>
        <div>
          <span>Inventory Value</span>
          <strong>{currencyFormatter.format(totalInventoryValue)}</strong>
        </div>
      </section>

      {flashMessage ? <p className="flash-banner">{flashMessage}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <section className="loading-state" aria-live="polite">
          <p>Loading products...</p>
        </section>
      ) : (
        <ProductTable products={products} onDeleteRequest={setProductToDelete} />
      )}

      <DeleteDialog
        open={Boolean(productToDelete)}
        productName={productToDelete?.name ?? ''}
        loading={isDeleting}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </>
  );
};

export default HomePage;
