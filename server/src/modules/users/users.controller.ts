import type { Request, Response } from 'express';
import * as usersService from './users.service.js';
import { updateRoleSchema } from './users.types.js';
import { Forbidden } from '@/core/utils/httpError.js';

export async function listUsersHandler(_req: Request, res: Response) {
  res.json(await usersService.listUsers());
}

export async function getUserHandler(req: Request, res: Response) {
  const id = req.params.id!;
  if (req.user!.role !== 'ADMIN' && req.user!.id !== id) throw Forbidden();
  res.json(await usersService.getUser(id));
}

export async function updateRoleHandler(req: Request, res: Response) {
  const { role } = updateRoleSchema.parse(req.body);
  res.json(await usersService.updateRole(req.params.id!, role));
}

export async function deleteUserHandler(req: Request, res: Response) {
  await usersService.deleteUser(req.params.id!);
  res.status(204).send();
}
