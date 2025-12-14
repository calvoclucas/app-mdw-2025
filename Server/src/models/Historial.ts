import "../models/Pedido";
import { Schema, model, Types, InferSchemaType } from "mongoose";
import Joi from "joi";

const historialSchema = new Schema(
  {
    id_pedido: { type: Types.ObjectId, ref: "Pedido", required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type HistorialType = InferSchemaType<typeof historialSchema>;
const HistorialModel = model<HistorialType>("Historial", historialSchema);

export const createHistorialSchema = Joi.object({
  id_pedido: Joi.string().required(), // el ObjectId se pasa como string
  fecha: Joi.date().optional(),
});

export const updateHistorialSchema = Joi.object({
  id_pedido: Joi.string().optional(),
  fecha: Joi.date().optional(),
});

export default HistorialModel;
