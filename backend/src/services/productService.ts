import { getDb } from '../database/db';
import type { Product, ProductInput } from '../types';

interface ProductRow {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

const baseSelect = `
  SELECT
    id,
    name,
    description,
    price,
    stock_quantity,
    created_at,
    updated_at
  FROM products
`;

const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  stockQuantity: row.stock_quantity,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const listProducts = (): Product[] => {
  const db = getDb();
  const rows = db
    .prepare(`${baseSelect} ORDER BY created_at DESC, id DESC`)
    .all() as ProductRow[];

  return rows.map(mapProduct);
};

export const getProductById = (id: number): Product | null => {
  const db = getDb();
  const row = db.prepare(`${baseSelect} WHERE id = ?`).get(id) as ProductRow | undefined;

  return row ? mapProduct(row) : null;
};

export const createProduct = (input: ProductInput): Product => {
  const db = getDb();
  const now = new Date().toISOString();
  const statement = db.prepare(`
    INSERT INTO products (name, description, price, stock_quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = statement.run(
    input.name,
    input.description,
    input.price,
    input.stockQuantity,
    now,
    now
  );

  return getProductById(Number(result.lastInsertRowid)) as Product;
};

export const updateProduct = (id: number, input: ProductInput): Product | null => {
  const db = getDb();
  const now = new Date().toISOString();
  const statement = db.prepare(`
    UPDATE products
    SET name = ?, description = ?, price = ?, stock_quantity = ?, updated_at = ?
    WHERE id = ?
  `);
  const result = statement.run(
    input.name,
    input.description,
    input.price,
    input.stockQuantity,
    now,
    id
  );

  if (result.changes === 0) {
    return null;
  }

  return getProductById(id);
};

export const deleteProduct = (id: number): boolean => {
  const db = getDb();
  const statement = db.prepare('DELETE FROM products WHERE id = ?');
  const result = statement.run(id);

  return result.changes > 0;
};
