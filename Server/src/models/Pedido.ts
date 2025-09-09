import { Schema, model, InferSchemaType, Types } from "mongoose";

const pedidoSchema = new Schema(
  {
    id_cliente: { type: Types.ObjectId, ref: "Cliente", required: true },
    id_empresa: { type: Types.ObjectId, ref: "Empresa", required: true },
    id_metodo_pago: { type: Types.ObjectId, ref: "MetodoPago", required: true },
    id_direccion: { type: Types.ObjectId, ref: "Direccion", required: true },
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    tiempo_estimado: { type: Number },
  },
  { timestamps: true }
);

export type PedidoType = InferSchemaType<typeof pedidoSchema>;
export default model<PedidoType>("Pedido", pedidoSchema);
