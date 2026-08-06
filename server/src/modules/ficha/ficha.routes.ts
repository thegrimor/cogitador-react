import { createOwnedResourceRouter } from '@/core/factories/ownedResource.js';
import { characterService } from './ficha.service.js';

export const fichaRouter = createOwnedResourceRouter(characterService);
