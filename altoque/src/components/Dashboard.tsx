import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import type { RootState, AppDispatch } from "../app/store.js";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import logo from "../assets/logo_altoque.png";
import EstadisticasEmpresa from "./EstadisticasEmpresa";
import { Pedido, EmpresaConUsuario, EstadoPedido } from "../types";
import PedidoDashboardBar from "./PedidosProgressDashboard";

interface Historial {
  _id: string;
  id_pedido?: {
    _id: string;
    id_cliente?: string;
    total?: number;
    estado?: string;
    createdAt?: string;
  };
  estado?: string;
  fecha?: string;
}

interface PexelsPhoto {
  photos: Array<{ src: { large2x: string } }>;
}

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const genericRestaurantImage =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const empresaIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const fetchLogoFromLogoDev = (companyName: string): string | null => {
  if (companyName.toLowerCase().includes("donald")) {
    return "https://img.logo.dev/McDonald's?size=256";
  }
  return null;
};

const fetchImageFromPexels = async (
  query: string,
  apiKey: string
): Promise<string> => {
  const termsToTry = [
    query,
    "restaurant interior",
    "food delivery",
    "restaurant",
    "food",
  ];
  for (const term of termsToTry) {
    if (!term) continue;
    try {
      const response = await axios.get<PexelsPhoto>(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          term
        )}&per_page=1`,
        { headers: { Authorization: apiKey } }
      );
      if (response.data.photos?.[0]?.src.large2x) {
        return response.data.photos[0].src.large2x;
      }
    } catch (error) {
      console.warn(`Pexels API error for query "${term}":`, error);
    }
  }
  return genericRestaurantImage;
};

const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="w-full h-28 bg-gray-300 rounded-t-xl"></div>
    <div className="p-3 flex flex-col gap-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const EmpresaCard: React.FC<{ empresa: EmpresaConUsuario; imagen: string }> = ({
  empresa,
  imagen,
}) => {
  const navigate = useNavigate();

  const abiertoAhora = (() => {
    if (
      !empresa.empresa ||
      !empresa.empresa.horario_apertura ||
      !empresa.empresa.horario_cierre
    )
      return false;

    const horaActual = new Date().getHours();
    const apertura = parseInt(empresa.empresa.horario_apertura.split(":")[0]);
    const cierre = parseInt(empresa.empresa.horario_cierre.split(":")[0]);
    if (apertura > cierre) return horaActual >= apertura || horaActual < cierre;
    return horaActual >= apertura && horaActual < cierre;
  })();

  const handleClick = () => {
    if (!empresa.empresa?._id) return;
    navigate(`/empresa/${empresa.empresa._id}`);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-md border border-gray-100 m-8 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={imagen}
          alt={empresa.empresa?.nombre || "Empresa"}
          className="w-full h-36 object-cover transition duration-300 hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src = genericRestaurantImage;
          }}
        />
        <div
          className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full shadow-md text-white`}
          style={{ backgroundColor: abiertoAhora ? "#16a34a" : "#dc2626" }}
        >
          {abiertoAhora
            ? `ABIERTO | Cierra ${empresa.empresa?.horario_cierre}`
            : `CERRADO | Abre ${empresa.empresa?.horario_apertura}`}
        </div>
        <div className="absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 text-xs font-semibold rounded-full shadow">
          Envío: ${empresa.empresa?.costo_envio.toFixed(2)}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2 text-sm">
        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-yellow-500 transition-colors">
          {empresa.empresa?.nombre}
        </h3>
        <p className="text-gray-600 flex items-center gap-1">
          {empresa.empresa?.email}
        </p>
        {empresa.empresa?.telefono && (
          <p className="text-gray-600 flex items-center gap-1">
            {empresa.empresa.telefono}
          </p>
        )}
      </div>
    </div>
  );
};

const PedidoCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => (
  <div className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">
        Total: ${Number(pedido.total || 0).toFixed(2)}
      </p>

      <p className="text-gray-500 text-sm">Estado: {pedido.estado}</p>
    </div>
    <p className="text-gray-400 text-xs">
      {new Date(pedido.createdAt).toLocaleString()}
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as
    | { mensaje?: string; tiempoEstimado?: number; horaListo?: string }
    | undefined;

  const [pedidoMensaje, setPedidoMensaje] = useState(state?.mensaje || "");
  const [tiempoEstimado, setTiempoEstimado] = useState(state?.tiempoEstimado);
  const [horaListo, setHoraListo] = useState(state?.horaListo);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<EmpresaConUsuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (state?.mensaje) {
      const timeout = setTimeout(() => setPedidoMensaje(""), 8000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  useEffect(() => {
    if (!user) return;

    const fetchPedidos = async () => {
      setLoading(true);
      try {
        let res;
        if (user.role === "cliente") {
          res = await axios.get<Historial[]>(
            `http://localhost:3001/Api/GetPedidosByCliente/${user._id}`
          );
        } else if (user.role === "empresa") {
          const empresaId = user.empresa?._id || user._id;
          res = await axios.get<Historial[]>(
            `http://localhost:3001/Api/GetPedidosByEmpresa/${empresaId}`
          );
        }

        const pedidosNormalizados: Pedido[] =
          res?.data.map((p) => {
            let estado: EstadoPedido = "pendiente";
            if (p.id_pedido?.estado === "en progreso") estado = "en progreso";

            return {
              _id: p._id,
              clienteNombre: p.id_pedido?.id_cliente || "Cliente desconocido",
              total: p.id_pedido?.total || 0,
              estado,
              createdAt:
                p.id_pedido?.createdAt || p.fecha || new Date().toISOString(),
            };
          }) || [];

        setPedidos(pedidosNormalizados);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        if (user.role === "cliente") {
          console.log("Obteniendo empresas...");
          const res = await axios.get<EmpresaConUsuario[]>(
            "http://localhost:3001/Api/GetEmpresasConUsuario"
          );

          const data = res.data.filter((e) => e.empresa);
          setEmpresas(data);

          const nuevasImagenes: { [key: string]: string } = {};
          await Promise.all(
            data.map(async (empresa) => {
              let imageUrl = fetchLogoFromLogoDev(empresa.empresa!.nombre);
              if (!imageUrl) {
                const query = empresa.empresa!.nombre.trim() || "restaurant";
                imageUrl = await fetchImageFromPexels(query, API_KEY);
              }
              nuevasImagenes[empresa._id] = imageUrl || genericRestaurantImage;
            })
          );
          setImagenes(nuevasImagenes);
        }

        const esEmpresa = user.role === "empresa" || !!user.empresa;
        if (esEmpresa) {
          const empresaId = user.empresa?._id || user._id;
          if (!empresaId) {
            console.warn("No se pudo determinar ID de empresa");
          } else {
            const res = await axios.get<Historial[]>(
              `http://localhost:3001/Api/GetHistorialesByEmpresa/${empresaId}`
            );

            const pedidosNormalizados: Pedido[] = res.data.map((p) => ({
              _id: p._id,
              clienteNombre: p.id_pedido?.id_cliente || "Cliente desconocido",
              total: p.id_pedido?.total || 0,
              estado: p.id_pedido?.estado || p.estado || "Desconocido",
              createdAt:
                p.id_pedido?.createdAt || p.fecha || new Date().toISOString(),
            }));

            setPedidos(pedidosNormalizados);
          }
        }
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      <header className="bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl text-yellow-400 font-semibold hidden sm:block">
            Altoque
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === "empresa" && (
            <button
              className="bg-blue-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-blue-700 transition-colors text-sm"
              onClick={() => {
                const id =
                  user?.role === "empresa" ? user?.empresa?._id : user?._id;
                navigate(`/productos/${id}`, { state: { tipo: user?.role } });
              }}
            >
              Administrar Productos
            </button>
          )}
          <button
            className="bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-green-300 transition-colors text-sm"
            onClick={() => {
              const id =
                user?.role === "empresa" ? user?.empresa?._id : user?._id;
              navigate(`/historial/${id}`, { state: { tipo: user?.role } });
            }}
          >
            Mis Pedidos
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-red-700 transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <section className="px-4 sm:px-6 py-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-5">
          Bienvenido,{" "}
          <span className="text-yellow-400 font-semibold">
            {user?.name || user?.email || "Usuario"}
          </span>
        </h2>

        {loading && <p>Cargando pedidos...</p>}
        {!loading && pedidos.length > 0 && (
          <div className="flex flex-col gap-4">
            {pedidos.map((pedido) => {
              const estadoValido: EstadoPedido =
                pedido.estado === "pendiente" || pedido.estado === "en progreso"
                  ? pedido.estado
                  : "pendiente";

              return (
                <PedidoDashboardBar
                  key={pedido._id}
                  pedido={{ ...pedido, estado: estadoValido }}
                />
              );
            })}
          </div>
        )}

        {pedidoMensaje && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-green-50 border border-green-400 text-green-800 rounded-xl shadow-md flex justify-between items-center animate-fade-in">
            <div>
              <p className="font-semibold">{pedidoMensaje}</p>
              {tiempoEstimado && horaListo && (
                <p className="text-sm text-green-700">
                  Tiempo estimado: {tiempoEstimado} min | Listo aprox:{" "}
                  {horaListo}
                </p>
              )}
            </div>
          </div>
        )}

        {loading && <p>Cargando...</p>}

        {user?.role === "cliente" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : empresas.map((item) => (
                  <EmpresaCard
                    key={item._id}
                    empresa={item}
                    imagen={imagenes[item._id]}
                  />
                ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {pedidos.length === 0 && !loading && <p>No hay pedidos aún</p>}
              {pedidos.map((pedido) => (
                <PedidoCard key={pedido._id} pedido={pedido} />
              ))}
            </div>
            {user?.role === "empresa" && pedidos.length > 0 && (
              <EstadisticasEmpresa pedidos={pedidos} />
            )}
          </>
        )}
      </section>
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

export default Dashboard;
