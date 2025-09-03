import { Schema, model, InferSchemaType, Types } from "mongoose";

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
export default model<DetallePedidoType>("Detalle_Pedido", detallePedidoSchema);
