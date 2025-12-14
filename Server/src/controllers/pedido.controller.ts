import { Request, Response } from "express";
import Pedido from "../models/Pedido";
import mongoose from "mongoose";

export const CreatePedido = async (req: Request, res: Response) => {
  try {
    const {
      id_cliente,
      id_empresa,
      id_metodo_pago,
      id_direccion,
      total,
      estado,
      tiempo_estimado,
    } = req.body;

    if (
      !id_cliente ||
      !id_empresa ||
      !id_metodo_pago ||
      !id_direccion ||
      total === undefined ||
      !estado
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const pedido = new Pedido({
      id_cliente,
      id_empresa,
      id_metodo_pago,
      id_direccion,
      total,
      estado,
      tiempo_estimado,
    });

    const savedPedido = await pedido.save();
    res.status(201).json(savedPedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
};

export const GetPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { id_cliente } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id_cliente)) {
      return res.status(400).json({ error: "ID de cliente inválido" });
    }
    const objectId = new mongoose.Types.ObjectId(id_cliente);
    const pedidos = await Pedido.find({ id_cliente: objectId })
      .populate("id_cliente")
      .populate("id_empresa")
      .populate("id_metodo_pago")
      .populate("id_direccion");

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los pedidos" });
  }
};

export const GetPedidosByEmpresa = async (req: Request, res: Response) => {
  try {
    const { id_empresa } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id_cliente)) {
  return res.status(400).json({ error: "ID de cliente inválido" });
}

    const objectId = new mongoose.Types.ObjectId(id_empresa);

    const pedidos = await Pedido.find({ id_empresa: objectId })
      .populate("id_cliente")
      .populate("id_empresa")
      .populate("id_metodo_pago")
      .populate("id_direccion");

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer los pedidos" });
  }
};

export const GetPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id)
      .populate("id_cliente")
      .populate("id_empresa")
      .populate("id_metodo_pago")
      .populate("id_direccion");

    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const EditPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pedidoActualizado = await Pedido.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("id_cliente")
      .populate("id_empresa")
      .populate("id_metodo_pago")
      .populate("id_direccion");

    if (!pedidoActualizado)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(pedidoActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el pedido" });
  }
};

export const DeletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedidoEliminado = await Pedido.findByIdAndDelete(id);

    if (!pedidoEliminado)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
};
