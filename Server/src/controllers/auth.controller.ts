import { Request, Response } from "express";
import admin from "../config/firebase";
import User from "../models/User";
import Empresa from "../models/Empresa";
import Cliente from "../models/Cliente";
import Joi from "joi";

const loginSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "El token es obligatorio",
    "any.required": "El token es obligatorio",
  }),
});

export const login = async (req: Request, res: Response) => {

  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { token } = value;

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid }).populate(
      "empresa cliente"
    );

    if (!user && email) {
      user = await User.findOne({ email }).populate("empresa cliente");
    }

    if (!user) {
      return res.status(404).json({
        error:
          "Usuario no encontrado. Debe registrarse antes de iniciar sesión.",
      });
    }

    const userResponse: any = {
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === "empresa" && user.empresa) {
      const empresa = await Empresa.findById(user.empresa);
      if (empresa) {
        userResponse.empresa = {
          _id: empresa._id,
          nombre: empresa.nombre,
          email: empresa.email,
          telefono: empresa.telefono,
          costo_envio: empresa.costo_envio,
          horario_apertura: empresa.horario_apertura,
          horario_cierre: empresa.horario_cierre,
        };
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

    res.json({message: "Login exitoso",user: userResponse,token,});
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
