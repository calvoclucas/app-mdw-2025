import { Request, Response } from "express";
import Cliente from "../models/Cliente";

export const GetClients = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los clientes" });
  }
};

export const GetClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateClient = async (req: Request, res: Response) => {
  try {
    const cliente = new Cliente(req.body);
    const newCliente = await cliente.save();
    res.status(201).json(newCliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const EditClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCliente = await Cliente.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(updatedCliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export const DeleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCliente = await Cliente.findByIdAndDelete(id);
    if (!deletedCliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};
