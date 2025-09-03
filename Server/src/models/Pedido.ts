import { Schema, model, InferSchemaType, Types } from "mongoose";

const pedidoSchema = new Schema(
  {
    id_pedido: { type: Number, required: true, unique: true },
    id_cliente: { type: Number, ref: "Cliente", required: true },
    id_empresa: { type: Number, ref: "Empresa", required: true },
    id_metodo_pago: { type: Number, ref: "MetodoPago", required: true },
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    id_direccion: { type: Number, ref: "Direccion", required: true },
    tiempo_estimado: { type: Number },
  },
  { timestamps: true }
);

export type PedidoType = InferSchemaType<typeof pedidoSchema>;
export const Pedido = model<PedidoType>("Pedido", pedidoSchema);
