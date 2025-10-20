import { Request, Response } from "express";
import admin from "../config/firebase";
import User from "../models/User";
import Empresa from "../models/Empresa";
import Cliente from "../models/Cliente";

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token requerido" });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, family_name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid }).populate(
      "cliente empresa"
    );

    if (!user && email) {
      user = await User.findOne({ email }).populate("cliente empresa");
    }

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email,
        name: name || "Sin nombre",
        lastName: family_name || "Sin apellido",
        role: "cliente",
      });
      await user.save();
    }

    let userResponse: any = {
      _id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
    };

    if (user.role === "empresa" && user.empresa) {
      const empresa = await Empresa.findById(user.empresa);
      if (empresa) {
        userResponse.empresa = { _id: empresa._id, nombre: empresa.nombre };
      }
    }

    if (user.role === "cliente" && user.cliente) {
      const cliente = await Cliente.findById(user.cliente);
      if (cliente) {
        userResponse.cliente = {
          _id: cliente._id,
          nombre: cliente.nombre,
          puntos: cliente.puntos,
        };
      }
    }

    res.json({ message: "Login exitoso", user: userResponse });
  } catch (error: any) {
    console.error(error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
