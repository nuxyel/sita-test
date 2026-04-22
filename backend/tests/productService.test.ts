import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} from '../src/services/productService';
import { resetTestDatabase, setupTestDatabase, teardownTestDatabase } from './testUtils';

describe('productService', () => {
  beforeAll(() => {
    setupTestDatabase('product-service');
  });

  beforeEach(() => {
    resetTestDatabase();
  });

  afterAll(() => {
    teardownTestDatabase();
  });

  it('creates and lists products', () => {
    createProduct({
      name: 'Warehouse Tablet',
      description: 'Tablet device for stock counting.',
      price: 799.9,
      stockQuantity: 5
    });

    const products = listProducts();

    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      name: 'Warehouse Tablet',
      stockQuantity: 5
    });
  });

  it('updates and deletes a product', () => {
    const created = createProduct({
      name: 'Barcode Printer',
      description: 'Thermal printer for warehouse labels.',
      price: 399.5,
      stockQuantity: 7
    });

    const updated = updateProduct(created.id, {
      name: 'Barcode Printer Pro',
      description: 'Thermal printer for warehouse labels.',
      price: 449.5,
      stockQuantity: 9
    });

    expect(updated).toMatchObject({
      id: created.id,
      name: 'Barcode Printer Pro',
      stockQuantity: 9
    });

    expect(deleteProduct(created.id)).toBe(true);
    expect(getProductById(created.id)).toBeNull();
  });
});
