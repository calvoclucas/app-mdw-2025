import React, { useMemo } from "react";
import { Pedido } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EstadisticasProps {
  pedidos: Pedido[];
}

const EstadisticasEmpresa: React.FC<EstadisticasProps> = ({ pedidos }) => {
  const totalPedidos = pedidos.length;
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const entregados = pedidos.filter((p) => p.estado === "entregado").length;
  const totalVentas = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);

  const pedidosPorEstado = useMemo(() => {
    const estados: Record<string, number> = {};
    pedidos.forEach((p) => {
      const estado = p.estado || "Desconocido";
      estados[estado] = (estados[estado] || 0) + 1;
    });
    return Object.entries(estados).map(([estado, count]) => ({
      estado,
      count,
    }));
  }, [pedidos]);

  const ventasPorAnio = useMemo(() => {
    const años: Record<string, number> = {};

    pedidos.forEach((p) => {
      const year = new Date(p.createdAt).getFullYear().toString();
      años[year] = (años[year] || 0) + (p.total || 0);
    });

    return Object.entries(años).map(([year, total]) => ({ year, total }));
  }, [pedidos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <p className="text-gray-500">Total Pedidos</p>
          <p className="text-2xl font-bold">{totalPedidos}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <p className="text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-500">{pendientes}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <p className="text-gray-500">Entregados</p>
          <p className="text-2xl font-bold text-green-500">{entregados}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <p className="text-gray-500">Total Ventas</p>
          <p className="text-2xl font-bold text-blue-500">
            ${totalVentas.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Pedidos por Estado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={pedidosPorEstado}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Ventas por Año</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={ventasPorAnio}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasEmpresa;
