import { Schema, model, InferSchemaType, Types } from "mongoose";
import Historial from "./Historial";

const pedidoSchema = new Schema(
  {
    id_cliente: { type: Types.ObjectId, ref: "Cliente", required: true },
    id_empresa: { type: Types.ObjectId, ref: "Empresa", required: true },
    id_metodo_pago: { type: Types.ObjectId, ref: "MetodoPago", required: true },
    id_direccion: { type: Types.ObjectId, ref: "Direccion", required: true },
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    tiempo_estimado: { type: Number },
  },
  { timestamps: true }
);

export type PedidoType = InferSchemaType<typeof pedidoSchema>;

pedidoSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  try {
    const historialExistente = await Historial.findOne({ id_pedido: doc._id });

    if (historialExistente) {
      historialExistente.fecha = new Date();
      await historialExistente.save();
      console.log("Historial actualizado para pedido:", doc._id);
    } else {
      await Historial.create({
        id_pedido: doc._id,
        estado: doc.estado,
        fecha: new Date(),
      });
      console.log("Historial creado automáticamente para pedido:", doc._id);
    }
  } catch (err) {
    console.error("Error al actualizar/crear historial:", err);
  }
});

export default model<PedidoType>("Pedido", pedidoSchema);
