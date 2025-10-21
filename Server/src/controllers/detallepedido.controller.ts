import { Request, Response } from "express";
import DetallePedido from "../models/DetallePedido";

export const GetDetallesPedido = async (req: Request, res: Response) => {
  try {
    const detalles = await DetallePedido.find()
      .populate("id_pedido")
      .populate("id_producto");
    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los detalles de pedido" });
  }
};

export const GetDetallePedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalle = await DetallePedido.findById(id)
      .populate("id_pedido")
      .populate("id_producto");
    if (!detalle)
      return res
        .status(404)
        .json({ message: "Detalle de pedido no encontrado" });
    res.json(detalle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const GetDetallesByPedido = async (req: Request, res: Response) => {
  try {
    const { id_pedido } = req.params;
    const detalles = await DetallePedido.find({ id_pedido })
      .populate("id_producto")
      .populate("id_pedido");

    if (!detalles || detalles.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay detalles para este pedido" });
    }

    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const CreateDetallePedido = async (req: Request, res: Response) => {
  try {
    const { detalles } = req.body;

    if (!Array.isArray(detalles)) {
      return res
        .status(400)
        .json({ error: "El campo 'detalles' debe ser un array" });
    }
    const nuevosDetalles = await DetallePedido.insertMany(detalles);

    res.status(201).json(nuevosDetalles);
  } catch (err) {
    console.error("Error al crear detalles del pedido:", err);
    res.status(500).json({ error: "Error al crear los detalles del pedido" });
  }
};

export const EditDetallePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedDetalle = await DetallePedido.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDetalle)
      return res
        .status(404)
        .json({ message: "Detalle de pedido no encontrado" });
    res.json(updatedDetalle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el detalle de pedido" });
  }
};

export const DeleteDetallePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDetalle = await DetallePedido.findByIdAndDelete(id);
    if (!deletedDetalle)
      return res
        .status(404)
        .json({ message: "Detalle de pedido no encontrado" });
    res.json({ message: "Detalle de pedido eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el detalle de pedido" });
  }
};
