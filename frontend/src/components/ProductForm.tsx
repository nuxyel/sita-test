import { useEffect, useState } from 'react';

import type {
  CreateProductDTO,
  ProductFormErrors,
  ProductFormValues
} from '../types';

interface ProductFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  initialValues?: CreateProductDTO;
  loading?: boolean;
  onSubmit: (payload: CreateProductDTO) => Promise<void>;
}

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  stockQuantity: ''
};

const toFormValues = (initialValues?: CreateProductDTO): ProductFormValues => {
  if (!initialValues) {
    return emptyValues;
  }

  return {
    name: initialValues.name,
    description: initialValues.description,
    price: initialValues.price.toString(),
    stockQuantity: initialValues.stockQuantity.toString()
  };
};

const validateValues = (values: ProductFormValues): ProductFormErrors => {
  const errors: ProductFormErrors = {};
  const parsedPrice = Number(values.price);
  const parsedStock = Number(values.stockQuantity);

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  } else if (values.name.trim().length > 100) {
    errors.name = 'Name must be at most 100 characters';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  } else if (values.description.trim().length > 500) {
    errors.description = 'Description must be at most 500 characters';
  }

  if (!values.price.trim()) {
    errors.price = 'Price is required';
  } else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!values.stockQuantity.trim()) {
    errors.stockQuantity = 'Stock quantity is required';
  } else if (!Number.isInteger(parsedStock)) {
    errors.stockQuantity = 'Stock quantity must be an integer';
  } else if (parsedStock < 0) {
    errors.stockQuantity = 'Stock cannot be negative';
  }

  return errors;
};

const renderFieldError = (error?: string) => (
  <small
    className={error ? 'field__error' : 'field__error field__error--placeholder'}
    aria-live="polite"
    aria-hidden={error ? undefined : true}
  >
    {error ?? '\u00A0'}
  </small>
);

const ProductForm = ({
  title,
  subtitle,
  submitLabel,
  initialValues,
  loading = false,
  onSubmit
}: ProductFormProps) => {
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setValues(toFormValues(initialValues));
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationErrors = validateValues(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity)
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save product.');
    }
  };

  return (
    <section className="form-shell">
      <div className="section-heading">
        <p className="section-heading__eyebrow">Product</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Galaxy Scanner"
          />
          {renderFieldError(errors.name)}
        </label>

        <label className="field field--full">
          <span>Description</span>
          <textarea
            name="description"
            rows={5}
            value={values.description}
            onChange={handleChange}
            placeholder="Short product description"
          />
          {renderFieldError(errors.description)}
        </label>

        <label className="field">
          <span>Price</span>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            placeholder="0.00"
          />
          {renderFieldError(errors.price)}
        </label>

        <label className="field">
          <span>Stock Quantity</span>
          <input
            type="number"
            name="stockQuantity"
            min="0"
            step="1"
            value={values.stockQuantity}
            onChange={handleChange}
            placeholder="0"
          />
          {renderFieldError(errors.stockQuantity)}
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
