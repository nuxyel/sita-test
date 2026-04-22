import type { NextFunction, Request, Response } from 'express';

import { verifyAuthToken } from '../services/authService';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid token' });
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Missing or invalid token' });
  }
};
