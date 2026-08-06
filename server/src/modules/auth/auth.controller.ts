import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.types.js';
import { Unauthorized } from '@/core/utils/httpError.js';

export async function registerHandler(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json(result);
}

export async function loginHandler(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json(result);
}

export async function meHandler(req: Request, res: Response) {
  if (!req.user) throw Unauthorized();
  const user = await authService.me(req.user.id);
  res.json(user);
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const input = forgotPasswordSchema.parse(req.body);
  const devToken = await authService.forgotPassword(input);
  res.json({
    message: 'Si el email existe, se ha enviado un enlace de recuperación',
    ...(devToken ? { devToken } : {}),
  });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const input = resetPasswordSchema.parse(req.body);
  await authService.resetPassword(input);
  res.json({ message: 'Contraseña actualizada' });
}
