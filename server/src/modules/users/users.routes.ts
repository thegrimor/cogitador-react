import { Router } from 'express';
import { asyncHandler } from '@/core/utils/asyncHandler.js';
import { requireAuth, requireRole } from '@/core/middleware/auth.js';
import { deleteUserHandler, getUserHandler, listUsersHandler, updateRoleHandler } from './users.controller.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/', requireRole('ADMIN'), asyncHandler(listUsersHandler));
usersRouter.get('/:id', asyncHandler(getUserHandler));
usersRouter.patch('/:id/role', requireRole('ADMIN'), asyncHandler(updateRoleHandler));
usersRouter.delete('/:id', requireRole('ADMIN'), asyncHandler(deleteUserHandler));
