import { Request, Response, NextFunction } from "express";

export const rolesGuard = (rolesPermitidos: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // auth o authOptional ya debieron setear req.user
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  };
};
