import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().trim().min(1).max(120),
});
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const renameCampaignSchema = z.object({
  name: z.string().trim().min(1).max(120),
});
export type RenameCampaignInput = z.infer<typeof renameCampaignSchema>;

export const addPlayerSchema = z.object({
  identifier: z.string().trim().min(1),
});
export type AddPlayerInput = z.infer<typeof addPlayerSchema>;
