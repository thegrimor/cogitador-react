import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '@/core/utils/asyncHandler.js';
import { requireAuth } from '@/core/middleware/auth.js';
import { Forbidden, NotFound } from '@/core/utils/httpError.js';

// Forma común de los recursos "propiedad de un usuario" (ficha, séquito,
// proyecto): un nombre + un blob JSON libre. Evita repetir el mismo CRUD
// tres veces mientras esos modelos de juego siguen sin cerrar en el frontend.
export interface OwnedRecord {
  id: string;
  userId: string;
  name: string;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnedResourceService {
  listByUser(userId: string): Promise<OwnedRecord[]>;
  getById(id: string): Promise<OwnedRecord | null>;
  create(userId: string, name: string, data: unknown): Promise<OwnedRecord>;
  update(id: string, changes: { name?: string; data?: unknown }): Promise<OwnedRecord>;
  remove(id: string): Promise<void>;
}

const upsertSchema = z.object({
  name: z.string().trim().min(1).max(120),
  data: z.unknown(),
});
const updateSchema = upsertSchema.partial();

function assertAccess(record: OwnedRecord | null, userId: string, role: string): OwnedRecord {
  if (!record) throw NotFound();
  if (record.userId !== userId && role !== 'ADMIN') throw Forbidden();
  return record;
}

export function createOwnedResourceRouter(service: OwnedResourceService): Router {
  const router = Router();
  router.use(requireAuth);

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      res.json(await service.listByUser(req.user!.id));
    }),
  );

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const input = upsertSchema.parse(req.body);
      const created = await service.create(req.user!.id, input.name, input.data);
      res.status(201).json(created);
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const record = assertAccess(await service.getById(req.params.id!), req.user!.id, req.user!.role);
      res.json(record);
    }),
  );

  router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      assertAccess(await service.getById(req.params.id!), req.user!.id, req.user!.role);
      const changes = updateSchema.parse(req.body);
      res.json(await service.update(req.params.id!, changes));
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      assertAccess(await service.getById(req.params.id!), req.user!.id, req.user!.role);
      await service.remove(req.params.id!);
      res.status(204).send();
    }),
  );

  return router;
}
