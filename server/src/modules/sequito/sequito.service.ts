import { Prisma } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import type { OwnedResourceService } from '@/core/factories/ownedResource.js';

export const sequitoService: OwnedResourceService = {
  listByUser: (userId) => prisma.sequitoEntry.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
  getById: (id) => prisma.sequitoEntry.findUnique({ where: { id } }),
  create: (userId, name, data) =>
    prisma.sequitoEntry.create({ data: { userId, name, data: data as Prisma.InputJsonValue } }),
  update: (id, changes) =>
    prisma.sequitoEntry.update({
      where: { id },
      data: { name: changes.name, data: changes.data as Prisma.InputJsonValue | undefined },
    }),
  remove: async (id) => {
    await prisma.sequitoEntry.delete({ where: { id } });
  },
};
