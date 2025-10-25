import { Request, Response } from "express";
import User from "../models/User";
import Empresa from "../models/Empresa";
import Cliente from "../models/Cliente";
import { Types } from "mongoose";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const detalles = await User.find();

    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer el usuario" });
  }
};

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, name, lastName, role, telefono } = req.body;

    if (!firebaseUid || !email || !name || !lastName || !role) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Usuario ya registrado" });
    }

    const user = new User({
      firebaseUid,
      email,
      name,
      lastName,
      role,
      isActive: true,
    });

    const newUser = await user.save();

    let perfilCreado = null;

    if (role === "empresa") {
      const empresa = new Empresa({
        nombre: `${name} ${lastName}`,
        email,
        telefono: telefono || "",
      });
      const empresaGuardada = await empresa.save();

      newUser.empresa = empresaGuardada._id as Types.ObjectId;
      await newUser.save();
      perfilCreado = empresaGuardada;
    }

    if (role === "cliente") {
      const cliente = new Cliente({
        nombre: `${name} ${lastName}`,
        email,
        telefono: telefono || "",
      });
      const clienteGuardado = await cliente.save();

      newUser.cliente = clienteGuardado._id as Types.ObjectId;
      await newUser.save();
      perfilCreado = clienteGuardado;
    }

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser,
      perfil: perfilCreado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

export const EditUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};
