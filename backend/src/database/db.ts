import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

let dbInstance: Database.Database | null = null;
let activeDatabasePath: string | null = null;

const schemaPath = path.resolve(process.cwd(), 'src/database/schema.sql');

const resolveDatabasePath = (): string => {
  const configuredPath = process.env.DATABASE_PATH ?? './database.sqlite';

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
};

const ensureDatabaseDirectory = (databasePath: string): void => {
  const directory = path.dirname(databasePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const applySchema = (database: Database.Database): void => {
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  database.exec(schema);
};

const createConnection = (databasePath: string): Database.Database => {
  ensureDatabaseDirectory(databasePath);

  const connection = new Database(databasePath);
  connection.pragma('foreign_keys = ON');
  connection.pragma('journal_mode = WAL');

  applySchema(connection);

  return connection;
};

export const getDb = (): Database.Database => {
  const nextDatabasePath = resolveDatabasePath();

  if (!dbInstance || activeDatabasePath !== nextDatabasePath) {
    closeDatabase();
    dbInstance = createConnection(nextDatabasePath);
    activeDatabasePath = nextDatabasePath;
  }

  return dbInstance;
};

export const initializeDatabase = (): Database.Database => getDb();

export const resetDatabase = (): void => {
  const db = getDb();

  db.exec(`
    DELETE FROM products;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('products', 'users');
  `);
};

export const closeDatabase = (): void => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    activeDatabasePath = null;
  }
};
