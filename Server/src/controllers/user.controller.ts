import { Request, Response } from "express";
import User from "../models/User";

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
    const { firebaseUid, email, name, lastName, role } = req.body;

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
    res
      .status(201)
      .json({ message: "Usuario creado correctamente", user: newUser });
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
