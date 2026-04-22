# SIDIA Inventory Management System

Full stack inventory app built for the SIDIA Full Stack Developer technical challenge.

## Quick Evaluation

Recommended runtime:

- a current Node.js LTS release

Run from the repository root:

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run seed
npm run dev
```

Application URLs:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`

Demo credentials after seeding:

- email: `nuxyel@sidia.dev`
- password: `password123`

It includes:

- product CRUD with a REST API
- JWT authentication for protected product routes
- SQLite persistence using raw SQL with `better-sqlite3`
- React frontend with product listing, create, edit, and delete flows
- backend and frontend automated tests

## Project Overview

The system allows an authenticated user to:

- view all products in a table
- add new products
- edit existing products
- delete products through a confirmation dialog

Each product stores:

- `id`
- `name`
- `description`
- `price`
- `stockQuantity`

## Tech Stack

### Backend

- Node.js + Express + TypeScript
- SQLite + `better-sqlite3`
- `jsonwebtoken` + `bcryptjs`
- Zod
- Jest + Supertest

### Frontend

- React 19 + Vite + TypeScript
- React Router
- Context API
- Vitest + React Testing Library

## Architecture Decisions

- The project uses React and TypeScript on the frontend because that is part of the role requirements. Node.js was used on the backend because it was discussed during the technical interview and provides a stable runtime choice for this kind of API.
- SQLite was chosen for this challenge because it keeps setup simple when the repository is cloned and still allows the SQL schema and CRUD queries to be implemented explicitly.
- Raw SQL was kept in service modules instead of using an ORM so the queries, constraints, and table design stay visible and easy to review.
- Context API was used for authentication and product state because this application has simple, low-frequency shared state and does not require the extra complexity of Redux or another larger state library.
- The login screen keeps the seeded demo credentials prefilled only to make the technical evaluation faster. This is a convenience for the challenge, not a relaxation of the authentication flow: if invalid credentials are submitted, the API still returns `401 Invalid credentials`.
- I am familiar with React guidance about avoiding unnecessary Effects. In this project, `useEffect` was kept mainly for straightforward page-level side effects such as loading data and reacting to route changes, because that kept the implementation simpler and easier to follow for the scope of the challenge.
- The backend was organized into routes, services, middleware, and database modules so HTTP handling, validation, authentication, and SQL logic remain separated and easier to maintain.
- The product form is reused for both create and edit flows to reduce duplication and keep the behavior consistent.
- The delete action uses a confirmation dialog on the home page instead of a separate page so the user can stay in the main inventory flow.
- The product table currently loads the full product list without pagination or filters because the challenge scope is intentionally small. In a production e-commerce inventory system, this should be extended with pagination, filtering, sorting, and possibly server-side search.

## Setup & Running

Recommended runtime:

- a current Node.js LTS release

Setup in 3 commands from the repository root:

```bash
npm install
cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env
npm run seed && npm run dev
```

Application URLs:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`

Useful commands:

- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run seed`

## Environment Variables

### Backend

File: `backend/.env`

```env
PORT=3001
JWT_SECRET=your_secret_key_here
DATABASE_PATH=./database.sqlite
```

### Frontend

File: `frontend/.env`

```env
VITE_API_URL=http://localhost:3001
```

## API Documentation

Base URL:

```text
http://localhost:3001
```

### Response Format

Success:

```json
{
  "data": {},
  "message": "Operation completed successfully"
}
```

Error:

```json
{
  "error": "Validation failed",
  "details": ["Name is required"]
}
```

### Auth Endpoints

#### `POST /api/auth/register`

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### `POST /api/auth/login`

The frontend login screen starts with the seeded demo credentials filled in only for convenience during the challenge review. Submitting invalid credentials still returns `401 Invalid credentials`.

Request:

```json
{
  "email": "nuxyel@sidia.dev",
  "password": "password123"
}
```

Response:

```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "email": "nuxyel@sidia.dev",
      "createdAt": "2026-04-18T16:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

### Product Endpoints

All product routes require:

```text
Authorization: Bearer <token>
```

#### `GET /api/products`

Returns all products.

#### `GET /api/products/:id`

Returns one product by id.

#### `POST /api/products`

Request:

```json
{
  "name": "Shelf Sensor",
  "description": "Sensor used for automated inventory shelf monitoring.",
  "price": 120.5,
  "stockQuantity": 10
}
```

#### `PUT /api/products/:id`

Request:

```json
{
  "name": "Shelf Sensor Pro",
  "description": "Updated sensor used for automated inventory shelf monitoring.",
  "price": 149.99,
  "stockQuantity": 18
}
```

#### `DELETE /api/products/:id`

Deletes a product and returns `204 No Content`.

### HTTP Status Codes

- `200` success for GET and PUT
- `201` success for POST
- `204` success for DELETE
- `400` validation failure
- `401` missing or invalid token
- `404` resource not found
- `500` internal server error

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL CHECK(price > 0),
  stock_quantity INTEGER NOT NULL CHECK(stock_quantity >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Index summary:

- `idx_products_name` supports product name lookups
- `idx_users_email` supports login and uniqueness checks

## Testing

Run all tests:

```bash
npm run test
```

### Backend Tests

Backend tests use `Jest` and `Supertest`.

Current backend coverage includes:

- service tests for product creation, listing, update, lookup, and deletion
- route integration tests for:
  - `POST /api/auth/login`
  - `401` on invalid login credentials
  - `GET /api/products`
  - `POST /api/products`
  - validation failure on `POST /api/products`
  - `GET /api/products/:id`
  - `404` on missing product
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
  - `401` when the token is missing

### Frontend Tests

Frontend tests use `Vitest` and `React Testing Library`.

Current frontend coverage includes:

- `ProductTable`
  - renders a product list correctly
  - renders the empty state
- `ProductForm`
  - validates required fields
  - submits the expected payload
- `DeleteDialog`
  - renders the confirmation message
  - calls the confirm callback
- `HomePage`
  - loads products on mount
  - completes the delete flow and shows the success banner

Verified locally:

- full build: passing
- backend: `12` passing tests
- frontend: `7` passing tests
- backend smoke test: health, auth, and product CRUD passing

## Delivery Validation

Before delivery, the project was checked with:

```bash
npm run build
npm run test
```

A backend smoke test was also executed against the compiled server, covering:

- health check
- user registration
- login
- product create, list, update, and delete

## CI

The repository includes a GitHub Actions workflow in `.github/workflows/ci.yml`.

The workflow runs on `push` and `pull_request` and performs:

- checkout
- Node.js `22` setup
- dependency installation for root, backend, and frontend
- `npm run build`
- `npm run test`

This keeps the project aligned with a simple CI standard and confirms that the application builds and the automated tests pass in a clean environment.

## Challenges Faced During Development

- One of the main challenges was keeping the SQLite tests isolated. Since the database is file-based, dedicated test database files and reset helpers were used so each test run starts from a clean state.
- Another point was keeping the backend code organized while still working with raw SQL. Product and authentication logic were moved into service modules so the route handlers could stay small and focused on HTTP concerns.
- Keeping validation behavior consistent between the API and the UI also required attention. The backend rejects invalid payloads with structured errors, while the frontend performs basic form validation and displays meaningful messages before or after API requests.
- The authentication flow needed to stay simple for review while still protecting the product endpoints. For that reason, the seeded demo user is documented and prefilled in the login screen, but invalid credentials and missing tokens are still handled as real authorization failures.
- On the frontend, the product list needs to handle loading, empty, success, and error states without making the CRUD flow feel heavy. The table, form reuse, and delete confirmation dialog were kept focused on the main inventory workflow.
- The project was also structured so it can be run from the repository root without mixing backend and frontend concerns. Root scripts use `npm --prefix`, which keeps each side independent while still making the application easy to start and test.
