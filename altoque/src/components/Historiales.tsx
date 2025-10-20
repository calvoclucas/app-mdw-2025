import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Pedido {
  _id: string;
  estado: string;
  total: number;
  fecha: string;
}

interface Historial {
  _id: string;
  id_pedido: Pedido;
  fecha: string;
}

interface HistorialesProps {
  tipo?: "cliente" | "empresa";
}

const Historiales: React.FC<HistorialesProps> = ({ tipo = "cliente" }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [historiales, setHistoriales] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.log(res.data);
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
              const pedido = hist.id_pedido;
              const estadoColor =
                pedido.estado === "Entregado"
                  ? "bg-green-500"
                  : pedido.estado === "Cancelado"
                  ? "bg-red-500"
                  : "bg-yellow-500";

              return (
                <div
                  key={hist._id}
                  className="bg-white rounded-2xl shadow-md p-4 border border-orange-100 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${estadoColor}`}
                    >
                      {pedido.estado.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    Total: ${pedido.total.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Fecha del pedido: {new Date(pedido.fecha).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Fecha del historial: {new Date(hist.fecha).toLocaleString()}
                  </p>
                </div>
              );
            })}
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
