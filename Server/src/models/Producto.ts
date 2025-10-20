import { Schema, model, InferSchemaType, Types } from "mongoose";

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
export default model<ProductoType>("Producto", productoSchema);
