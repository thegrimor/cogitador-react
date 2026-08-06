import { createOwnedResourceRouter } from '@/core/factories/ownedResource.js';
import { proyectosService } from './proyectos.service.js';

export const proyectosRouter = createOwnedResourceRouter(proyectosService);
