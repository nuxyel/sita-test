import 'dotenv/config';

import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';

import { initializeDatabase } from './database/db';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      data: { status: 'ok' },
      message: 'Service is healthy'
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof SyntaxError) {
      res.status(400).json({
        error: 'Validation failed',
        details: ['Invalid JSON payload']
      });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  };

  app.use(errorHandler);

  return app;
};

export const app = createApp();

if (require.main === module) {
  initializeDatabase();

  const port = Number(process.env.PORT ?? 3001);
  app.listen(port);
}
