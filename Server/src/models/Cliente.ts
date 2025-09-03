import { Schema, model, InferSchemaType } from "mongoose";

const clienteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String },
    puntos: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ClienteType = InferSchemaType<typeof clienteSchema>;
export default model<ClienteType>("Cliente", clienteSchema);
