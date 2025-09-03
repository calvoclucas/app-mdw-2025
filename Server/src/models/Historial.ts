import { Schema, model, InferSchemaType, Types } from "mongoose";

const historialSchema = new Schema(
  {
    id_pedido: { type: Types.ObjectId, ref: "Pedido", required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type HistorialType = InferSchemaType<typeof historialSchema>;
export const Historial = model<HistorialType>("Historial", historialSchema);

export default Historial;
