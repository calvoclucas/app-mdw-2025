import { Request, Response } from "express";
import MetodoPago from "../models/MetodoPago";

export const GetMetodosPago = async (req: Request, res: Response) => {
  try {
    const metodos = await MetodoPago.find();
    res.json(metodos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los métodos de pago" });
  }
};

export const GetMetodoPagoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const metodo = await MetodoPago.findById(id);
    if (!metodo)
      return res.status(404).json({ message: "Método de pago no encontrado" });
    res.json(metodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateMetodoPago = async (req: Request, res: Response) => {
  try {
    const metodo = new MetodoPago(req.body);
    const newMetodo = await metodo.save();
    res.status(201).json(newMetodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el método de pago" });
  }
};

export const EditMetodoPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMetodo = await MetodoPago.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMetodo)
      return res.status(404).json({ message: "Método de pago no encontrado" });
    res.json(updatedMetodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el método de pago" });
  }
};

export const DeleteMetodoPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMetodo = await MetodoPago.findByIdAndDelete(id);
    if (!deletedMetodo)
      return res.status(404).json({ message: "Método de pago no encontrado" });
    res.json({ message: "Método de pago eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el método de pago" });
  }
};
