import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";
import User from "../models/User";

export const authRequired = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no enviado" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (firebaseError: any) {
      console.error(
        "❌ Error al verificar token con Firebase:",
        firebaseError.code
      );
      return res.status(401).json({
        error: "Token inválido o expirado",
        details: firebaseError.code,
      });
    }
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email });
      if (user) {
        user.firebaseUid = decoded.uid;
        await user.save();
      }
    }

    if (!user) {
      return res.status(401).json({
        error: "Usuario no válido",
        hint: "El usuario existe en Firebase pero no en la base de datos",
      });
    }
    req.user = user;
    next();
  } catch (error: any) {
    console.error("Stack:", error.stack);
    res.status(401).json({ error: "Error de autenticación" });
  }
};
