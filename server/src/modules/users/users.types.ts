import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MASTER', 'USER']),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
