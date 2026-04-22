import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} from '../services/productService';

const router = Router();

const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().min(1, 'Description is required').max(500),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stockQuantity: z.coerce
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
});

const idSchema = z.object({
  id: z.coerce.number().int().positive('Product ID must be a positive integer')
});

router.use(requireAuth);

router.get('/', (_req, res) => {
  const products = listProducts();

  return res.status(200).json({
    data: products,
    message: 'Products retrieved successfully'
  });
});

router.get('/:id', validate(idSchema, 'params'), (req, res) => {
  const id = Number((req.params as { id: string }).id);
  const product = getProductById(id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.status(200).json({
    data: product,
    message: 'Product retrieved successfully'
  });
});

router.post('/', validate(productSchema), (req, res) => {
  const product = createProduct(req.body);

  return res.status(201).json({
    data: product,
    message: 'Product created successfully'
  });
});

router.put('/:id', validate(idSchema, 'params'), validate(productSchema), (req, res) => {
  const id = Number((req.params as { id: string }).id);
  const product = updateProduct(id, req.body);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.status(200).json({
    data: product,
    message: 'Product updated successfully'
  });
});

router.delete('/:id', validate(idSchema, 'params'), (req, res) => {
  const id = Number((req.params as { id: string }).id);
  const deleted = deleteProduct(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.status(204).send();
});

export default router;
