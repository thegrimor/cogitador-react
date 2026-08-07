import { createOwnedResourceRouter } from '@/core/factories/ownedResource.js';
import { notasService } from './notas.service.js';

export const notasRouter = createOwnedResourceRouter(notasService);
