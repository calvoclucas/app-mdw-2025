import { Request, Response } from "express";
import Empresa from "../models/Empresa";

export const GetEmpresas = async (req: Request, res: Response) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer las empresas" });
  }
};

export const GetEmpresaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    if (!empresa)
      return res.status(404).json({ message: "Empresa no encontrada" });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateEmpresa = async (req: Request, res: Response) => {
  try {
    const empresa = new Empresa(req.body);
    const newEmpresa = await empresa.save();
    res.status(201).json(newEmpresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la empresa" });
  }
};

export const EditEmpresa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEmpresa = await Empresa.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedEmpresa)
      return res.status(404).json({ message: "Empresa no encontrada" });
    res.json(updatedEmpresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la empresa" });
  }
};

export const DeleteEmpresa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEmpresa = await Empresa.findByIdAndDelete(id);
    if (!deletedEmpresa)
      return res.status(404).json({ message: "Empresa no encontrada" });
    res.json({ message: "Empresa eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la empresa" });
  }
};
