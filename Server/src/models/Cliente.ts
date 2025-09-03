import mongoose, { Schema, model, InferSchemaType, Types } from "mongoose";

const clienteSchema = new Schema(
  {
    id_cliente: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String },
    puntos: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ClienteType = InferSchemaType<typeof clienteSchema>;
export const Cliente = model<ClienteType>("Cliente", clienteSchema);
export default Cliente