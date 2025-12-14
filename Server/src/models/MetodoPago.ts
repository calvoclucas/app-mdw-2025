import { Schema, model, InferSchemaType } from "mongoose";
import Joi from "joi";

const metodoPagoSchema = new Schema(
  {
    tipo: { type: String, required: true },
  },
  { timestamps: true }
);

export type MetodoPagoType = InferSchemaType<typeof metodoPagoSchema>;
const MetodoPagoModel = model<MetodoPagoType>("MetodoPago", metodoPagoSchema);

export const createMetodoPagoSchema = Joi.object({
  tipo: Joi.string().required(),
});

export const updateMetodoPagoSchema = Joi.object({
  tipo: Joi.string().optional(),
});

export default MetodoPagoModel;
