import crypto from 'node:crypto';
import { prisma } from '@/core/db/prisma.js';
import { comparePassword, hashPassword } from '@/core/utils/password.js';
import { signToken } from '@/core/utils/jwt.js';
import { Conflict, NotFound, Unauthorized } from '@/core/utils/httpError.js';
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from './auth.types.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function toPublicUser(user: { id: string; username: string; email: string; role: string }) {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username: input.username }, { email: input.email }] },
  });
  if (existing) throw Conflict('El usuario o el email ya están en uso');

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { username: input.username, email: input.email, passwordHash },
  });

  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: toPublicUser(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: input.identifier }, { email: input.identifier }] },
  });
  if (!user) throw Unauthorized('Credenciales inválidas');

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw Unauthorized('Credenciales inválidas');

  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: toPublicUser(user) };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw NotFound('Usuario no encontrado');
  return toPublicUser(user);
}

// No hay proveedor de email configurado todavía: el token se genera y se
// persiste, pero el "envío" es un log. Cuando se integre un proveedor
// (Resend, Nodemailer + SMTP, etc.) solo hay que sustituir ese console.log.
export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Respuesta idéntica exista o no el usuario, para no filtrar qué emails están registrados.
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  console.log(`[auth] Reset de contraseña para ${user.email}: token=${token}`);
  return process.env.NODE_ENV === 'production' ? undefined : token;
}

export async function resetPassword(input: ResetPasswordInput) {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: input.token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw Unauthorized('Token de recuperación inválido o expirado');
  }

  const passwordHash = await hashPassword(input.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);
}
