import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER']),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
