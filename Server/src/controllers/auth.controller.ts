import { Request, Response } from "express";
import admin from "../config/firebase";
import User from "../models/User";

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; 
    if (!token) return res.status(400).json({ error: "Token requerido" });

    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid, email, name } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, email, name: name || "Sin nombre" });
      await user.save();
    }

    res.json({ message: "Login exitoso", user });
  } catch (error: any) {
    console.error(error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
