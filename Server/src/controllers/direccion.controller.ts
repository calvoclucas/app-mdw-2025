import { Request, Response } from "express";
import Direccion from "../models/Direccion";
import { Types } from "mongoose";

export const GetDirecciones = async (req: Request, res: Response) => {
  try {
    const direcciones = await Direccion.find().populate("id_user");
    res.json(direcciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer las direcciones" });
  }
};

export const GetDireccionByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const direccion = await Direccion.findOne({
      id_user: new Types.ObjectId(id),
    }).populate("id_user");

    if (!direccion)
      return res.status(404).json({ message: "Dirección no encontrada" });

    res.json(direccion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateDireccion = async (req: Request, res: Response) => {
  try {
    const direccion = new Direccion(req.body);
    const newDireccion = await direccion.save();
    res.status(201).json(newDireccion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la dirección" });
  }
};

export const EditDireccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedDireccion = await Direccion.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDireccion)
      return res.status(404).json({ message: "Dirección no encontrada" });
    res.json(updatedDireccion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la dirección" });
  }
};

export const DeleteDireccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDireccion = await Direccion.findByIdAndDelete(id);
    if (!deletedDireccion)
      return res.status(404).json({ message: "Dirección no encontrada" });
    res.json({ message: "Dirección eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la dirección" });
  }
};
