import { Schema, model, InferSchemaType, Types } from "mongoose";

const direccionSchema = new Schema(
  {
    id_direccion: { type: Number, required: true, unique: true },
    id_cliente: { type: Number, ref: "Cliente", required: true },
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
export const Direccion = model<DireccionType>("Direccion", direccionSchema);
