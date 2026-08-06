import { Prisma } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import type { OwnedResourceService } from '@/core/factories/ownedResource.js';

export const proyectosService: OwnedResourceService = {
  listByUser: (userId) => prisma.proyecto.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
  getById: (id) => prisma.proyecto.findUnique({ where: { id } }),
  create: (userId, name, data) =>
    prisma.proyecto.create({ data: { userId, name, data: data as Prisma.InputJsonValue } }),
  update: (id, changes) =>
    prisma.proyecto.update({
      where: { id },
      data: { name: changes.name, data: changes.data as Prisma.InputJsonValue | undefined },
    }),
  remove: async (id) => {
    await prisma.proyecto.delete({ where: { id } });
  },
};
