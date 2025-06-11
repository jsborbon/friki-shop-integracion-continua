import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { requireAuth } from "@clerk/express";

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Opción 1: Usar void para marcar explícitamente que ignoras la promesa
    void requireAuth()(req, res, (error?: unknown) => {
      if (error) {
        console.error("Clerk authentication error:", error);

        if (typeof error === "object" && error !== null && "message" in error) {
          res.status(401).json({
            message:
              (error as { message: string }).message ||
              "Clerk authentication error",
          });
          return;
        }

        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (!req.auth?.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    });
  }
}
