import { Schema, model, InferSchemaType, Types } from "mongoose";
import Joi from "joi";

const detallePedidoSchema = new Schema(
  {
    id_pedido: { type: Types.ObjectId, ref: "Pedido", required: true },
    id_producto: { type: Types.ObjectId, ref: "Producto", required: true },
    cantidad: { type: Number, required: true },
    precio_unitario: { type: Number, required: true },
  },
  { timestamps: true }
);

export type DetallePedidoType = InferSchemaType<typeof detallePedidoSchema>;
const DetallePedidoModel = model<DetallePedidoType>("Detalle_Pedido", detallePedidoSchema);

export const createDetallePedidoSchema = Joi.object({
  id_pedido: Joi.string().hex().length(24).required(),
  id_producto: Joi.string().hex().length(24).required(),
  cantidad: Joi.number().min(1).required(),
  precio_unitario: Joi.number().min(0).required(),
});

export const updateDetallePedidoSchema = Joi.object({
  id_pedido: Joi.string().hex().length(24).optional(),
  id_producto: Joi.string().hex().length(24).optional(),
  cantidad: Joi.number().min(1).optional(),
  precio_unitario: Joi.number().min(0).optional(),
});

export default DetallePedidoModel;
