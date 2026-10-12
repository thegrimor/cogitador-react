import { prisma } from '@/core/db/prisma.js';
import { comparePassword, hashPassword } from '@/core/utils/password.js';
import { signToken } from '@/core/utils/jwt.js';
import { Conflict, NotFound, Unauthorized } from '@/core/utils/httpError.js';
import type { LoginInput, RegisterInput, ResetPasswordInput } from './auth.types.js';

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

// App entre amigos, sin email: quien conozca el usuario/email puede fijar una contraseña nueva.
export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: input.identifier }, { email: input.identifier }] },
  });
  if (!user) throw NotFound('Usuario no encontrado');

  const passwordHash = await hashPassword(input.password);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
}
