import { Schema, model, InferSchemaType, Types } from "mongoose";
import Joi from "joi";

// Mongoose Schema
const direccionSchema = new Schema(
  {
    id_user: { type: Types.ObjectId, ref: "User", required: true },
    calle: { type: String, required: true },
    numero: { type: Number },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    cp: { type: String },
    coordenadas: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export type DireccionType = InferSchemaType<typeof direccionSchema>;
const DireccionModel = model<DireccionType>("Direccion", direccionSchema);

export const createDireccionSchema = Joi.object({
  id_user: Joi.string().hex().length(24).required(),
  calle: Joi.string().min(1).required(),
  numero: Joi.number().optional(),
  ciudad: Joi.string().min(1).required(),
  provincia: Joi.string().min(1).required(),
  cp: Joi.string().optional(),
  coordenadas: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

export const updateDireccionSchema = Joi.object({
  calle: Joi.string().min(1).optional(),
  numero: Joi.number().optional(),
  ciudad: Joi.string().min(1).optional(),
  provincia: Joi.string().min(1).optional(),
  cp: Joi.string().optional(),
  coordenadas: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

export default DireccionModel;
