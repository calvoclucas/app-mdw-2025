import React from "react";
import { motion } from "framer-motion";
import { Clock, Truck, Check, XCircle } from "lucide-react";
import { Pedido, EstadoPedido } from "../types";

interface PedidoProgressBarProps {
  pedido: Pedido & { estado: EstadoPedido };
}

const estadosDashboard: EstadoPedido[] = [
  "pendiente",
  "en progreso",
  "entregado",
];

const iconosDashboard: Record<EstadoPedido, React.FC<any>> = {
  pendiente: Clock,
  "en progreso": Truck,
  entregado: Check,
  cancelado: XCircle,
};

export default function PedidoDashboardBar({ pedido }: PedidoProgressBarProps) {
  const estadoActual: EstadoPedido = estadosDashboard.includes(
    pedido.estado as EstadoPedido
  )
    ? (pedido.estado as EstadoPedido)
    : "pendiente";

  const currentIndex = estadosDashboard.indexOf(estadoActual);
  const IconActual = iconosDashboard[estadoActual];

  const mensajes: Record<EstadoPedido, string> = {
    pendiente: "Espera que la empresa confirme",
    "en progreso": "La empresa lo está preparando",
    entregado: "Pedido entregado ✅",
    cancelado: "Pedido cancelado",
  };

  return (
    <div className="w-full mt-3 bg-white p-4 rounded-2xl shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-yellow-100 p-2 rounded-full">
          <IconActual
            className={`w-6 h-6 ${
              estadoActual === "en progreso"
                ? "text-blue-600"
                : estadoActual === "entregado"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 capitalize">
            Estado:{" "}
            <span
              className={`${
                estadoActual === "en progreso"
                  ? "text-blue-600"
                  : estadoActual === "entregado"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {estadoActual}
            </span>
          </h3>
          <p className="text-xs text-gray-500">{mensajes[estadoActual]}</p>
        </div>
      </div>

      <div className="relative flex justify-between items-center w-full mx-auto px-2">
        {estadosDashboard.map((estado, i) => {
          const completado = i <= currentIndex;
          const Icon = iconosDashboard[estado];

          return (
            <div
              key={estado}
              className="flex flex-col items-center flex-1 relative"
            >
              {i < estadosDashboard.length - 1 && (
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
    </div>
  );
}
