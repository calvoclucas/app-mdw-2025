import { Schema, model, InferSchemaType, Types } from "mongoose";

const detallePedidoSchema = new Schema(
  {
    id_detalle: { type: Number, required: true, unique: true },
    id_pedido: { type: Number, ref: "Pedido", required: true },
    id_producto: { type: Number, ref: "Producto", required: true },
    cantidad: { type: Number, required: true },
    precio_unitario: { type: Number, required: true },
  },
  { timestamps: true }
);

export type DetallePedidoType = InferSchemaType<typeof detallePedidoSchema>;
export const DetallePedido = model<DetallePedidoType>(
  "Detalle_Pedido",
  detallePedidoSchema
);
