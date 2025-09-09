import { Schema, model, InferSchemaType } from "mongoose";

const empresaSchema = new Schema(
  {
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
export default model<EmpresaType>("Empresa", empresaSchema);
