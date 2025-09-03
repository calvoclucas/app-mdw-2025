import { Schema, model, InferSchemaType, Types } from "mongoose";

const historialSchema = new Schema(
  {
    id_historial: { type: Number, required: true, unique: true },
    id_pedido: { type: Number, ref: "Pedido", required: true },
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type HistorialType = InferSchemaType<typeof historialSchema>;
export const Historial = model<HistorialType>("Historial", historialSchema);
