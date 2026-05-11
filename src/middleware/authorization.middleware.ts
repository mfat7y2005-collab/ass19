
import { Request, Response, NextFunction } from "express";

export const authorization = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      if (roles.length && !roles.includes(user.role)) {
        return next(new Error("Forbidden: Access denied"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}