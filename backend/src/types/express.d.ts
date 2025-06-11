// src/types/express.d.ts
declare namespace Express {
  export interface Request {
    auth?: {
      userId?: string;
      sessionId?: string;
      // ... otras propiedades de Clerk que necesites
    };
  }
}