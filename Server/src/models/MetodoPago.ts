import { Schema, model, InferSchemaType } from "mongoose";

const metodoPagoSchema = new Schema(
  {
    tipo: { type: String, required: true },
  },
  { timestamps: true }
);

export type MetodoPagoType = InferSchemaType<typeof metodoPagoSchema>;
export default model<MetodoPagoType>("MetodoPago", metodoPagoSchema);
