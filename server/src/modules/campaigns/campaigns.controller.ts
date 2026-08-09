import type { Request, Response } from 'express';
import * as campaignsService from './campaigns.service.js';
import { addPlayerSchema, createCampaignSchema, renameCampaignSchema } from './campaigns.types.js';

export async function createCampaignHandler(req: Request, res: Response) {
  const input = createCampaignSchema.parse(req.body);
  const campaign = await campaignsService.createCampaign(req.user!.id, input.name);
  res.status(201).json(campaign);
}

export async function listCampaignsHandler(req: Request, res: Response) {
  res.json(await campaignsService.listCampaignsForUser(req.user!.id, req.user!.role));
}

export async function getCampaignHandler(req: Request, res: Response) {
  res.json(await campaignsService.getCampaignDetail(req.params.id!, req.user!.id, req.user!.role));
}

export async function renameCampaignHandler(req: Request, res: Response) {
  const input = renameCampaignSchema.parse(req.body);
  res.json(await campaignsService.renameCampaign(req.params.id!, input.name, req.user!.id, req.user!.role));
}

export async function deleteCampaignHandler(req: Request, res: Response) {
  await campaignsService.deleteCampaign(req.params.id!, req.user!.id, req.user!.role);
  res.status(204).send();
}

export async function addPlayerHandler(req: Request, res: Response) {
  const input = addPlayerSchema.parse(req.body);
  const member = await campaignsService.addPlayer(req.params.id!, input.identifier, req.user!.id, req.user!.role);
  res.status(201).json(member);
}

export async function removePlayerHandler(req: Request, res: Response) {
  await campaignsService.removePlayer(req.params.id!, req.params.userId!, req.user!.id, req.user!.role);
  res.status(204).send();
}
