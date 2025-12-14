import { Request, Response, NextFunction } from "express";

export const authRequired = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debe iniciar sesión para realizar esta acción",
    });
  }
  next();
};

// OBLIGAR AL USUARIO A ESTAR AUTENTICADO PARA PODER ACCEDER A CIERTAS RUTAS