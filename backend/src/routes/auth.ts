import { Router } from 'express';
import { z } from 'zod';

import { validate } from '../middleware/validate';
import { authenticateUser, registerUser } from '../services/authService';

const router = Router();

const authSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

router.post('/register', validate(authSchema), async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    if (!user) {
      return res.status(400).json({
        error: 'Registration failed',
        details: ['Email is already registered']
      });
    }

    return res.status(201).json({
      data: user,
      message: 'User registered successfully'
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', validate(authSchema), async (req, res, next) => {
  try {
    const authResponse = await authenticateUser(req.body);

    if (!authResponse) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    return res.status(200).json({
      data: authResponse,
      message: 'Login successful'
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
