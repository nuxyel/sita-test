import 'dotenv/config';

import { resetDatabase } from './db';
import { createProduct } from '../services/productService';
import { registerUser } from '../services/authService';

const seed = async (): Promise<void> => {
  resetDatabase();

  await registerUser({
    email: 'nuxyel@sidia.dev',
    password: 'password123'
  });

  createProduct({
    name: 'Galaxy S Inventory Scanner',
    description: 'Handheld scanner configured for warehouse intake and stock reconciliation.',
    price: 1499.9,
    stockQuantity: 12
  });

  createProduct({
    name: 'Samsung SmartTag Batch',
    description: 'Pack of SmartTags for high-value item tracking across the inventory floor.',
    price: 299.5,
    stockQuantity: 48
  });

  createProduct({
    name: 'Retail Display Stand',
    description: 'Modular showroom stand used for promotional product placement.',
    price: 899.0,
    stockQuantity: 6
  });

  console.log('Seed completed. Demo credentials: nuxyel@sidia.dev / password123');
};

void seed();
