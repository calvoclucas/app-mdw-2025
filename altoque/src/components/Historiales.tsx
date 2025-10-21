import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Pedido } from "../types";

interface Historial {
  _id: string;
  id_pedido: Pedido;
  fecha: string;
}

interface DetallePedido {
  _id: string;
  id_producto: {
    _id: string;
    nombre: string;
  };
  cantidad: number;
  precio_unitario: number;
}

const Historiales: React.FC = () => {
  const location = useLocation();
  const tipo =
    (location.state as { tipo?: "cliente" | "empresa" })?.tipo || "cliente";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [historiales, setHistoriales] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleVerDetalle = async (idPedido: string) => {
    try {
      const { data } = await axios.get<DetallePedido[]>(
        `http://localhost:3001/Api/GetDetallesByPedido/${idPedido}`
      );
      setDetalles(data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error al obtener los detalles del pedido:", err);
      alert("No se pudo obtener los detalles del pedido.");
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchHistoriales = async () => {
      setLoading(true);
      try {
        const url =
          tipo === "cliente"
            ? `http://localhost:3001/Api/GetHistorialesByCliente/${id}`
            : `http://localhost:3001/Api/GetHistorialesByEmpresa/${id}`;

        const res = await axios.get<Historial[]>(url);
        setHistoriales(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los historiales");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoriales();
  }, [id, tipo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-all mb-6"
        >
          <ArrowLeft size={20} />
          Volver al Inicio
        </button>

        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">
          Historial de Pedidos
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {tipo === "cliente"
            ? "Revisa tus pedidos realizados"
            : "Revisa los pedidos de la empresa"}
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando historiales...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && historiales.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No hay pedidos aún
              </h2>
              <p className="text-gray-600 mb-6">
                {tipo === "cliente"
                  ? "Tus pedidos aparecerán aquí una vez realizados"
                  : "No hay pedidos registrados para esta empresa"}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all"
              >
                Explorar empresas
              </button>
            </div>
          </div>
        )}

        {!loading && historiales.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historiales.map((hist) => {
              const pedidoNormalizado = {
                total: hist.id_pedido?.total || 0,
                fecha:
                  hist.id_pedido?.createdAt ||
                  hist.fecha ||
                  new Date().toISOString(),
              };

              return (
                <div
                  key={hist._id}
                  className="bg-white rounded-2xl shadow-md p-4 border border-orange-100 hover:shadow-xl transition-all"
                >
                  <p className="text-gray-600 mb-1">
                    Total: ${pedidoNormalizado.total.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Fecha del pedido:{" "}
                    {new Date(pedidoNormalizado.fecha).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Fecha del historial: {new Date(hist.fecha).toLocaleString()}
                  </p>

                  <button
                    onClick={() => handleVerDetalle(hist.id_pedido._id)}
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
                  >
                    Ver detalle
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {modalOpen && detalles.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Detalle del Pedido
              </h2>

              <div className="divide-y divide-gray-200">
                {detalles.map((det) => (
                  <div key={det._id} className="py-3">
                    <p className="font-semibold text-gray-800">
                      {det.id_producto?.nombre}
                    </p>
                    <p className="text-gray-600">
                      Cantidad: {det.cantidad} — Precio unitario: $
                      {det.precio_unitario.toFixed(2)}
                    </p>
                    <p className="text-gray-700 font-medium mt-1">
                      Subtotal: $
                      {(det.cantidad * det.precio_unitario).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>
                  $
                  {detalles
                    .reduce(
                      (acc, det) => acc + det.cantidad * det.precio_unitario,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Historiales;
