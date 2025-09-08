import { Request, Response } from "express";
import Historial from "../models/Historial";

export const GetHistoriales = async (req: Request, res: Response) => {
  try {
    const historiales = await Historial.find();
    res.json(historiales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los historiales" });
  }
};

export const GetHistorialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const historial = await Historial.findById(id).populate("id_pedido");
    if (!historial)
      return res.status(404).json({ message: "Historial no encontrado" });
    res.json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateHistorial = async (req: Request, res: Response) => {
  try {
    const historial = new Historial(req.body);
    const newHistorial = await historial.save();
    res.status(201).json(newHistorial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el historial" });
  }
};

export const EditHistorial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedHistorial = await Historial.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedHistorial)
      return res.status(404).json({ message: "Historial no encontrado" });
    res.json(updatedHistorial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el historial" });
  }
};

export const DeleteHistorial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedHistorial = await Historial.findByIdAndDelete(id);
    if (!deletedHistorial)
      return res.status(404).json({ message: "Historial no encontrado" });

    res.json({ message: "Historial eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el historial" });
  }
};
