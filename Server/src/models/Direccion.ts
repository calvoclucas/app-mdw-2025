import { Schema, model, InferSchemaType, Types } from "mongoose";

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
export default model<DireccionType>("Direccion", direccionSchema);
