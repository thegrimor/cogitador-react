import { Prisma } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import type { OwnedResourceService } from '@/core/factories/ownedResource.js';

export const characterService: OwnedResourceService = {
  listByUser: (userId) => prisma.character.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
  getById: (id) => prisma.character.findUnique({ where: { id } }),
  create: (userId, name, data) =>
    prisma.character.create({ data: { userId, name, data: data as Prisma.InputJsonValue } }),
  update: (id, changes) =>
    prisma.character.update({
      where: { id },
      data: { name: changes.name, data: changes.data as Prisma.InputJsonValue | undefined },
    }),
  remove: async (id) => {
    await prisma.character.delete({ where: { id } });
  },
};
