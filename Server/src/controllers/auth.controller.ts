import { Request, Response } from "express";
import admin from "../config/firebase";
import User, { deleteUser } from "../models/User";
import Empresa from "../models/Empresa";
import Cliente from "../models/Cliente";
import Direccion from "../models/Direccion"
import Joi from "joi";
import { Types } from "mongoose";
import { join } from "path";

const loginSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "El token es obligatorio",
    "any.required": "El token es obligatorio",
  })
});

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body) ;

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token } = value;

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid }).populate("empresa cliente");

    if (!user && email && user.isActive) {
      user = await User.findOne({ email }).populate("empresa cliente");
    }else if (!user.isActive) {
      return res.status(404).json({error: "El usuario se encuentra deshabilitado! Volver a crear el usuario"});
    }

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado. Debe registrarse antes de iniciar sesión.",
      });
    }

    const dir = await Direccion.findOne({
      id_user: new Types.ObjectId(user._id),
    }).populate("id_user");


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
      direccion: dir ?? null,
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
          telefono: cliente.telefono,
        };
      }
    }

    res.json({ message: "Login exitoso", user: userResponse, token });
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token no enviado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decoded.uid })
      .populate("empresa cliente");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const direccion = await Direccion.findOne({ id_user: user._id });

    const response: any = {
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      direccion,
    };

    if (user.role === "empresa" && user.empresa) {
      const empresa = await Empresa.findById(user.empresa);
      if (empresa) {
        response.empresa = {
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
        response.cliente = {
          _id: cliente._id,
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          puntos: cliente.puntos,
        };
      }
    }

    return res.json(response);
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try{

  }catch(error){
    return res.status(401).json({ error: "Token inválido" });
  }
}
export const deleteUser = async(req:Request, res:Response)=>{
   try{
      const id_user = req.params.id;

      if (!id_user) {
            return res.status(400).json({ error: "El ID del usuario es requerido en el cuerpo de la solicitud." });
        }
      const deletedUser = await User.findOneAndUpdate({_id: id_user}, {isActive: false});

      if (!deletedUser) {
                  return res.status(404).json({ error: "Usuario no encontrado." });
              }

        return res.status(200).json({ 
            message: "Usuario eliminado con éxito",
            deletedUser: {
                id: deletedUser._id,
                email: (deletedUser as any).email
            }
        });

  }catch(error){
    return res.status(401).json({ error: "Token inválido" });
  }
}