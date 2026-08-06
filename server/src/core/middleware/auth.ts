import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { verifyToken } from '@/core/utils/jwt.js';
import { Forbidden, Unauthorized } from '@/core/utils/httpError.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(Unauthorized('Falta el token de autenticación'));
  }

  try {
    const payload = verifyToken(header.slice('Bearer '.length));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(Unauthorized('Token inválido o expirado'));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(Unauthorized());
    if (!roles.includes(req.user.role)) return next(Forbidden());
    next();
  };
}
