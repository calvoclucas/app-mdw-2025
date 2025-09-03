import { Schema, model, InferSchemaType, Types } from "mongoose";

const productoSchema = new Schema(
  {
    id_producto: { type: Number, required: true, unique: true },
    id_empresa: { type: Number, ref: "Empresa", required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    retiro_local: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ProductoType = InferSchemaType<typeof productoSchema>;
export const Producto = model<ProductoType>("Producto", productoSchema);
