import { Schema, model, InferSchemaType } from "mongoose";
import Joi from "joi";

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
const ClienteModel = model<ClienteType>("Cliente", clienteSchema);

export const createClienteSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().pattern(/^[0-9]+$/).min(7).max(15).optional(),
  puntos: Joi.number().min(0).optional(),
});

export const updateClienteSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  telefono: Joi.string().pattern(/^[0-9]+$/).min(7).max(15).optional(),
  puntos: Joi.number().min(0).optional(),
});

export default ClienteModel;
