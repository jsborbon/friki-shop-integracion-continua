import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { clerkExpressWithAuth } from '@clerk/express';

// Carga las variables de entorno para Clerk
// Asegúrate de tener CLERK_SECRET_KEY o CLERK_PUBLISHABLE_KEY y CLERK_API_KEY en tu .env
const clerkMiddleware = clerkExpressWithAuth();

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Aplica la validación de Clerk (analiza cookies o Authorization header)
      await new Promise<void>((resolve, reject) => {
        clerkMiddleware(req, res, (err: any) => (err ? reject(err) : resolve()));
      });

      // Si no hay usuario autenticado, lanza error
      if (!req.auth?.userId) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
      }

      // El usuario está autenticado, continúa
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }
}