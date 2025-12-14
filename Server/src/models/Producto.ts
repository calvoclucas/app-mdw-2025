import { Schema, model, InferSchemaType, Types } from "mongoose";
import Joi from "joi";

const productoSchema = new Schema(
  {
    id_empresa: { type: Types.ObjectId, ref: "Empresa", required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    retiro_local: { type: Boolean, default: false },
    cantidad: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProductoType = InferSchemaType<typeof productoSchema>;
const ProductoModel = model<ProductoType>("Producto", productoSchema);

export const createProductoSchema = Joi.object({
  id_empresa: Joi.string().required(),
  nombre: Joi.string().required(),
  descripcion: Joi.string().optional(),
  precio: Joi.number().required(),
  retiro_local: Joi.boolean().optional(),
  cantidad: Joi.number().optional(),
});

export const updateProductoSchema = Joi.object({
  id_empresa: Joi.string().optional(),
  nombre: Joi.string().optional(),
  descripcion: Joi.string().optional(),
  precio: Joi.number().optional(),
  retiro_local: Joi.boolean().optional(),
  cantidad: Joi.number().optional(),
});

export default ProductoModel;
