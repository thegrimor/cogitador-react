import { Prisma } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import type { OwnedResourceService } from '@/core/factories/ownedResource.js';

export const notasService: OwnedResourceService = {
  listByUser: (userId) => prisma.nota.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
  getById: (id) => prisma.nota.findUnique({ where: { id } }),
  create: (userId, name, data) =>
    prisma.nota.create({ data: { userId, name, data: data as Prisma.InputJsonValue } }),
  update: (id, changes) =>
    prisma.nota.update({
      where: { id },
      data: { name: changes.name, data: changes.data as Prisma.InputJsonValue | undefined },
    }),
  remove: async (id) => {
    await prisma.nota.delete({ where: { id } });
  },
};
