import { Schema, model, InferSchemaType, Types } from "mongoose";

const metodoPagoSchema = new Schema(
  {
    id_metodo_pago: { type: Number, required: true, unique: true },
    tipo: { type: String, required: true },
  },
  { timestamps: true }
);

export type MetodoPagoType = InferSchemaType<typeof metodoPagoSchema>;
export const MetodoPago = model<MetodoPagoType>("MetodoPago", metodoPagoSchema);
