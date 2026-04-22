import fs from 'node:fs';
import path from 'node:path';

import { closeDatabase, initializeDatabase, resetDatabase } from '../src/database/db';

const testDirectory = path.join(__dirname, 'tmp');

export const setupTestDatabase = (name: string): void => {
  const databasePath = path.join(testDirectory, `${name}.sqlite`);

  fs.mkdirSync(testDirectory, { recursive: true });
  process.env.JWT_SECRET = 'test-secret';
  process.env.DATABASE_PATH = databasePath;

  closeDatabase();

  if (fs.existsSync(databasePath)) {
    fs.rmSync(databasePath, { force: true });
  }

  initializeDatabase();
};

export const resetTestDatabase = (): void => {
  resetDatabase();
};

export const teardownTestDatabase = (): void => {
  const databasePath = process.env.DATABASE_PATH;

  closeDatabase();

  if (databasePath && fs.existsSync(databasePath)) {
    fs.rmSync(databasePath, { force: true });
  }
};
