import "../models/Pedido";
import { Schema, model, Types, InferSchemaType } from "mongoose";

const historialSchema = new Schema({
  id_pedido: { type: Types.ObjectId, ref: "Pedido", required: true },
  estado: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

export type HistorialType = InferSchemaType<typeof historialSchema>;
export default model<HistorialType>("Historial", historialSchema);
