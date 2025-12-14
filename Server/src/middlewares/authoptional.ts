import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";
import User from "../models/User";

export const authOptional = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null; // INVITADO
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
