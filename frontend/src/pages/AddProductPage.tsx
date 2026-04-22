import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import type { CreateProductDTO } from '../types';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: CreateProductDTO): Promise<void> => {
    setSubmitting(true);

    try {
      await addProduct(payload);
      navigate('/', {
        state: { message: 'Product created successfully.' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="editor-layout">
      <div className="editor-layout__intro">
        <p className="section-heading__eyebrow">New Product</p>
        <h1>Add a product</h1>
        <p>Enter the product details and save.</p>
        <Link to="/" className="button button--ghost">
          Back to Inventory
        </Link>
      </div>

      <ProductForm
        title="New product"
        subtitle="Fill in the fields below."
        submitLabel="Save Product"
        loading={submitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default AddProductPage;
