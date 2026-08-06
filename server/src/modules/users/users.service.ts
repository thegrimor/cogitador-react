import type { Role } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import { NotFound } from '@/core/utils/httpError.js';

const publicSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export function listUsers() {
  return prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: 'asc' } });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: publicSelect });
  if (!user) throw NotFound('Usuario no encontrado');
  return user;
}

export async function updateRole(id: string, role: Role) {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw NotFound('Usuario no encontrado');
  return prisma.user.update({ where: { id }, data: { role }, select: publicSelect });
}

export async function deleteUser(id: string) {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw NotFound('Usuario no encontrado');
  await prisma.user.delete({ where: { id } });
}
