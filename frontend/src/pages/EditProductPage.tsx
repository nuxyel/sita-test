import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ProductForm from '../components/ProductForm';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { ApiClientError, api } from '../services/api';
import type { CreateProductDTO, Product } from '../types';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { updateProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      setNotFound(true);
      setLoadingProduct(false);
      return;
    }

    let isMounted = true;

    const loadProduct = async (): Promise<void> => {
      setLoadingProduct(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await api.getProduct(productId);

        if (isMounted) {
          setProduct(response.data);
        }
      } catch (errorValue) {
        if (!isMounted) {
          return;
        }

        if (errorValue instanceof ApiClientError && errorValue.status === 404) {
          setNotFound(true);
          return;
        }

        if (errorValue instanceof ApiClientError && errorValue.status === 401) {
          logout();
          navigate('/login', { replace: true });
          return;
        }

        setError(
          errorValue instanceof ApiClientError
            ? errorValue.details.join(' ') || errorValue.message
            : 'Unable to load product.'
        );
      } finally {
        if (isMounted) {
          setLoadingProduct(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, logout, navigate]);

  const handleSubmit = async (payload: CreateProductDTO): Promise<void> => {
    if (!product) {
      return;
    }

    setSubmitting(true);

    try {
      await updateProduct(product.id, payload);
      navigate('/', {
        state: { message: 'Product updated successfully.' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <section className="loading-state" aria-live="polite">
        <p>Loading product details...</p>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="empty-state">
        <p className="empty-state__eyebrow">404</p>
        <h1>Product not found.</h1>
        <p>The requested product no longer exists or the identifier is invalid.</p>
        <Link to="/" className="button">
          Return to Inventory
        </Link>
      </section>
    );
  }

  if (error || !product) {
    return <p className="form-error">{error ?? 'Unable to load product.'}</p>;
  }

  return (
    <section className="editor-layout">
      <div className="editor-layout__intro">
        <p className="section-heading__eyebrow">Edit Product</p>
        <h1>Edit {product.name}</h1>
        <p>Update the product details and save the changes.</p>
        <Link to="/" className="button button--ghost">
          Back to Inventory
        </Link>
      </div>

      <ProductForm
        title={`Edit ${product.name}`}
        subtitle="Update the fields below."
        submitLabel="Update Product"
        loading={submitting}
        initialValues={{
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default EditProductPage;
