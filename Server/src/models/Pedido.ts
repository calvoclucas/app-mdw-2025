import { Schema, model, InferSchemaType, Types } from "mongoose";
import Historial from "./Historial";
import Joi from "joi";

const pedidoSchema = new Schema(
  {
    id_cliente: { type: Types.ObjectId, ref: "User", required: true },
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
const PedidoModel = model<PedidoType>("Pedido", pedidoSchema);

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

export const createPedidoSchema = Joi.object({
  id_cliente: Joi.string().required(),
  id_empresa: Joi.string().required(),
  id_metodo_pago: Joi.string().required(),
  id_direccion: Joi.string().required(),
  estado: Joi.string().required(),
  total: Joi.number().required(),
  tiempo_estimado: Joi.number().optional(),
});

export const updatePedidoSchema = Joi.object({
  id_cliente: Joi.string().optional(),
  id_empresa: Joi.string().optional(),
  id_metodo_pago: Joi.string().optional(),
  id_direccion: Joi.string().optional(),
  estado: Joi.string().optional(),
  total: Joi.number().optional(),
  tiempo_estimado: Joi.number().optional(),
});

export default PedidoModel;
