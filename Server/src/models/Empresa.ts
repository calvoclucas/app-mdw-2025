import { Schema, model, InferSchemaType, Types } from "mongoose";

const empresaSchema = new Schema(
  {
    id_empresa: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    horario_apertura: { type: String },
    horario_cierre: { type: String },
    costo_envio: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type EmpresaType = InferSchemaType<typeof empresaSchema>;
export const Empresa = model<EmpresaType>("Empresa", empresaSchema);
