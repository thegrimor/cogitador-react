import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(32),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(1), // username o email
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
