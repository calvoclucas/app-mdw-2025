import { Request, Response } from "express";
import Empresa from "../models/Empresa";
import User from "../models/User";
import Direccion from "../models/Direccion";
import Producto from "../models/Producto";

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

export const GetEmpresasConUsuario = async (req: Request, res: Response) => {
  try {
    const usuariosEmpresa = await User.find({ role: "empresa" })
      .populate("empresa")
      .lean();

    const resultado = await Promise.all(
      usuariosEmpresa.map(async (user) => {
        const direccion = await Direccion.findOne({ id_user: user._id }).lean();
        return {
          _id: user._id,
          email: user.email,
          nombreUsuario: `${user.name} ${user.lastName}`,
          empresa: user.empresa,
          direccion,
        };
      })
    );

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener empresas con usuario" });
  }
};

export const buscarEmpresasConProductos = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
    }

    const productos = await Producto.find({
      nombre: { $regex: q, $options: "i" },
    }).populate("id_empresa");

    const empresaIds = productos.map((p) => p.id_empresa);

    const empresas = await Empresa.find({
      $or: [
        { nombre: { $regex: q, $options: "i" } },
        { _id: { $in: empresaIds } },
      ],
    });

    res.json(empresas);
  } catch (error) {
    console.error("Error buscando empresas:", error);
    res.status(500).json({ error: "Error buscando empresas" });
  }
};