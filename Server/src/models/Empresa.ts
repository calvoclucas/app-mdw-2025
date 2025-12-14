import { Schema, model, InferSchemaType } from "mongoose";
import Joi from "joi";

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
const EmpresaModel = model<EmpresaType>("Empresa", empresaSchema);

export const createEmpresaSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  telefono: Joi.string().optional(),
  horario_apertura: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  horario_cierre: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  costo_envio: Joi.number().min(0).optional(),
});

export const updateEmpresaSchema = Joi.object({
  nombre: Joi.string().min(1).optional(),
  email: Joi.string().email().optional(),
  telefono: Joi.string().optional(),
  horario_apertura: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  horario_cierre: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  costo_envio: Joi.number().min(0).optional(),
});

export default EmpresaModel;
