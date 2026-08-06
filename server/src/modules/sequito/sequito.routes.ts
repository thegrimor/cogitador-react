import { createOwnedResourceRouter } from '@/core/factories/ownedResource.js';
import { sequitoService } from './sequito.service.js';

export const sequitoRouter = createOwnedResourceRouter(sequitoService);
