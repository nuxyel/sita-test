import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getDb } from '../database/db';
import type {
  AuthResponse,
  AuthTokenPayload,
  LoginInput,
  PublicUser,
  User
} from '../types';

interface UserRow {
  id: number;
  email: string;
  password: string;
  created_at: string;
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  password: row.password,
  createdAt: row.created_at
});

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt
});

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return secret;
};

export const getUserById = (id: number): User | null => {
  const db = getDb();
  const row = db
    .prepare(`
      SELECT id, email, password, created_at
      FROM users
      WHERE id = ?
    `)
    .get(id) as UserRow | undefined;

  return row ? mapUser(row) : null;
};

export const getUserByEmail = (email: string): User | null => {
  const db = getDb();
  const row = db
    .prepare(`
      SELECT id, email, password, created_at
      FROM users
      WHERE email = ?
    `)
    .get(email.toLowerCase()) as UserRow | undefined;

  return row ? mapUser(row) : null;
};

export const registerUser = async (input: LoginInput): Promise<PublicUser | null> => {
  const existingUser = getUserByEmail(input.email);

  if (existingUser) {
    return null;
  }

  const db = getDb();
  const passwordHash = await bcrypt.hash(input.password, 10);
  const result = db
    .prepare(`
      INSERT INTO users (email, password, created_at)
      VALUES (?, ?, ?)
    `)
    .run(input.email.toLowerCase(), passwordHash, new Date().toISOString());

  const user = getUserById(Number(result.lastInsertRowid));

  return user ? toPublicUser(user) : null;
};

export const generateToken = (user: PublicUser): string =>
  jwt.sign({ email: user.email }, getJwtSecret(), {
    expiresIn: '24h',
    subject: user.id.toString()
  });

export const authenticateUser = async (input: LoginInput): Promise<AuthResponse | null> => {
  const user = getUserByEmail(input.email);

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    return null;
  }

  const publicUser = toPublicUser(user);

  return {
    token: generateToken(publicUser),
    user: publicUser
  };
};

export const verifyAuthToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
