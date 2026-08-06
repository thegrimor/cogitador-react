import { Router } from 'express';
import { asyncHandler } from '@/core/utils/asyncHandler.js';
import { requireAuth } from '@/core/middleware/auth.js';
import {
  forgotPasswordHandler,
  loginHandler,
  meHandler,
  registerHandler,
  resetPasswordHandler,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerHandler));
authRouter.post('/login', asyncHandler(loginHandler));
authRouter.get('/me', requireAuth, asyncHandler(meHandler));
authRouter.post('/forgot-password', asyncHandler(forgotPasswordHandler));
authRouter.post('/reset-password', asyncHandler(resetPasswordHandler));
