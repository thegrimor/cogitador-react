import express from 'express';
import cors from 'cors';
import { env } from '@/config/env.js';
import { errorHandler, notFoundHandler } from '@/core/middleware/errorHandler.js';
import { authRouter } from '@/modules/auth/auth.routes.js';
import { usersRouter } from '@/modules/users/users.routes.js';
import { fichaRouter } from '@/modules/ficha/ficha.routes.js';
import { sequitoRouter } from '@/modules/sequito/sequito.routes.js';
import { proyectosRouter } from '@/modules/proyectos/proyectos.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/fichas', fichaRouter);
  app.use('/api/sequito', sequitoRouter);
  app.use('/api/proyectos', proyectosRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
