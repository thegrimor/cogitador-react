import { Router } from 'express';
import { asyncHandler } from '@/core/utils/asyncHandler.js';
import { requireAuth, requireRole } from '@/core/middleware/auth.js';
import {
  addPlayerHandler,
  createCampaignHandler,
  deleteCampaignHandler,
  getCampaignHandler,
  listCampaignsHandler,
  removePlayerHandler,
  renameCampaignHandler,
} from './campaigns.controller.js';

export const campaignsRouter = Router();

campaignsRouter.use(requireAuth);

campaignsRouter.post('/', requireRole('ADMIN', 'MASTER'), asyncHandler(createCampaignHandler));
campaignsRouter.get('/', asyncHandler(listCampaignsHandler));
campaignsRouter.get('/:id', asyncHandler(getCampaignHandler));
campaignsRouter.patch('/:id', asyncHandler(renameCampaignHandler));
campaignsRouter.delete('/:id', asyncHandler(deleteCampaignHandler));
campaignsRouter.post('/:id/players', asyncHandler(addPlayerHandler));
campaignsRouter.delete('/:id/players/:userId', asyncHandler(removePlayerHandler));
