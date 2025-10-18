import { Request, Response } from "express";
import Producto from "../models/Producto";

export const GetProductos = async (req: Request, res: Response) => {
  try {
    const productos = await Producto.find().populate("id_empresa");
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los productos" });
  }
};

export const GetProductoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate("id_empresa");
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateProducto = async (req: Request, res: Response) => {
  try {
    const producto = new Producto(req.body);
    const newProducto = await producto.save();
    res.status(201).json(newProducto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

export const EditProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProducto = await Producto.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProducto)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProducto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

export const DeleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProducto = await Producto.findByIdAndDelete(id);
    if (!deletedProducto)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
