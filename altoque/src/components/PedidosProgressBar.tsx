import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Truck, XCircle, AlertTriangle } from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
type EstadoPedido = "pendiente" | "en progreso" | "entregado" | "cancelado";

interface Pedido {
  _id: string;
  estado: EstadoPedido;
}

interface PedidoProgressBarProps {
  pedido: Pedido;
  tipo: "empresa" | "cliente";
  onUpdate?: (id: string, nuevoEstado: EstadoPedido) => void;
}

const estados: EstadoPedido[] = [
  "pendiente",
  "en progreso",
  "entregado",
  "cancelado",
];

const iconos = {
  pendiente: Clock,
  "en progreso": Truck,
  entregado: Check,
  cancelado: XCircle,
};

export default function PedidoProgressBar({
  pedido,
  tipo,
  onUpdate,
}: PedidoProgressBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [accion, setAccion] = useState<EstadoPedido | "">("");
  const [loading, setLoading] = useState(false);

  const estadoActual = pedido.estado.toLowerCase() as EstadoPedido;
  const currentIndex = estados.indexOf(estadoActual);
  const IconActual = iconos[estadoActual] || Clock;

  const abrirModal = (accionTipo: EstadoPedido) => {
    setAccion(accionTipo);
    setModalOpen(true);
  };

  const handleChangeEstado = async (nuevoEstado: EstadoPedido) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/Api/EditPedido/${pedido._id}`, {
        estado: nuevoEstado,
      });

      onUpdate?.(pedido._id, nuevoEstado);
    } catch (err) {
      console.error("Error al actualizar el pedido:", err);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="w-full mt-3">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="bg-yellow-100 p-2 rounded-full">
          <IconActual
            className={`w-6 h-6 ${
              estadoActual === "entregado"
                ? "text-green-600"
                : estadoActual === "en progreso"
                ? "text-blue-600"
                : estadoActual === "cancelado"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 capitalize">
          Estado:{" "}
          <span
            className={`${
              estadoActual === "entregado"
                ? "text-green-600"
                : estadoActual === "en progreso"
                ? "text-blue-600"
                : estadoActual === "cancelado"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {estadoActual}
          </span>
        </h3>
      </div>
      <div className="relative flex justify-between items-center w-full mx-auto px-4">
        {estados.map((estado, i) => {
          const completado = i <= currentIndex;
          const Icon = iconos[estado];
          return (
            <div
              key={estado}
              className="flex flex-col items-center flex-1 relative"
            >
              {i < estados.length - 1 && (
                <div
                  className={`absolute top-1/2 left-[50%] w-full h-1 -translate-y-1/2 z-0 transition-all duration-700 ${
                    i < currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: completado ? 1.1 : 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  completado
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium capitalize ${
                  completado ? "text-green-600" : "text-gray-400"
                }`}
              >
                {estado}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-3 mt-4">
        {tipo === "empresa" && estadoActual === "pendiente" && (
          <button
            onClick={() => abrirModal("en progreso")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow"
          >
            Marcar en progreso
          </button>
        )}

        {tipo === "empresa" && estadoActual === "en progreso" && (
          <button
            onClick={() => abrirModal("entregado")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow"
          >
            Marcar entregado
          </button>
        )}

        {tipo === "cliente" &&
          ["pendiente", "en progreso"].includes(estadoActual) && (
            <button
              onClick={() => abrirModal("cancelado")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow"
            >
              Cancelar pedido
            </button>
          )}
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Confirmar acción
              </h2>
              <p className="text-gray-600 mb-4">
                ¿Seguro que deseas{" "}
                <span className="font-semibold text-gray-800">
                  {accion === "cancelado"
                    ? "cancelar este pedido"
                    : `marcarlo como "${accion}"`}
                </span>
                ?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition text-sm font-semibold"
                  disabled={loading}
                >
                  No, volver
                </button>
                <button
                  onClick={() => accion && handleChangeEstado(accion)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition shadow ${
                    accion === "cancelado"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Sí, confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
