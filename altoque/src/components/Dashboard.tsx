import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import type { RootState, AppDispatch } from "../app/store.js";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo_altoque.png";
import Footer from "../components/Footer";
import { Pedido, EstadoPedido } from ".././types";
import EstadisticasEmpresa from "../components/EstadisticasEmpresa";
import PedidoDashboardBar from "../components/PedidosProgressDashboard";

interface Empresa {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  costo_envio?: number;
}

interface EmpresaConUsuarioBackend {
  _id: string;
  email: string;
  nombreUsuario: string;
  empresa: {
    _id: string;
    nombre: string;
    email: string;
    telefono?: string;
    horario_apertura?: string;
    horario_cierre?: string;
    costo_envio?: number;
  };
  direccion?: any;
}

interface PexelsResponse {
  photos: {
    src: {
      large: string;
      large2x: string;
      medium: string;
    };
  }[];
}

interface PedidoState {
  mensaje?: string;
  tiempoEstimado?: number;
  horaListo?: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const genericRestaurantImage =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

/*
const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="w-full h-28 bg-gray-300 rounded-t-xl"></div>
    <div className="p-3 flex flex-col gap-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);*/

const EmpresaCard: React.FC<{
  empresa: Empresa;
  imagen: string;
  onFavorite?: (id: string) => void;
  favorito?: boolean;
}> = ({ empresa, imagen, onFavorite, favorito }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const abiertoAhora = (() => {
    if (!empresa.horario_apertura || !empresa.horario_cierre) return false;
    const horaActual = new Date().getHours();
    const apertura = parseInt(empresa.horario_apertura.split(":")[0]);
    const cierre = parseInt(empresa.horario_cierre.split(":")[0]);
    return apertura > cierre
      ? horaActual >= apertura || horaActual < cierre
      : horaActual >= apertura && horaActual < cierre;
  })();

  const handleClick = () => {
    if (!empresa._id) return;

    if (!abiertoAhora) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }

    navigate(`/empresa/${empresa._id}`);
  };

  return (
    <div className="relative">
      <div
        className="group bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-md border border-gray-100 m-4 cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative">
          <img
            src={imagen || genericRestaurantImage}
            alt={empresa.nombre || "Empresa"}
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
              ? `ABIERTO | Cierra ${empresa.horario_cierre}`
              : `CERRADO | Abre ${empresa.horario_apertura}`}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2 text-sm">
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-yellow-500 transition-colors">
            {empresa.nombre}
          </h3>
          <p className="text-gray-600">{empresa.email}</p>
          {empresa.telefono && (
            <p className="text-gray-600">{empresa.telefono}</p>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed top-16 right-8 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
          La empresa "{empresa.nombre}" está cerrada. Vuelve durante su horario
          de apertura.
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as PedidoState | undefined;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [pedidoMensaje, setPedidoMensaje] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [showGuestToast, setShowGuestToast] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state?.mensaje) {
      setPedidoMensaje(state.mensaje);
      const timer = setTimeout(() => setPedidoMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.name === "Invitado") {
      setShowGuestToast(true);
      const timer = setTimeout(() => setShowGuestToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const handleLogin = () => navigate("/login");
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        if (user.role === "empresa" && token && user._id !== "guest") {
          const res = await axios.get<EmpresaConUsuarioBackend[]>(
            `${API_URL}/Api/GetEmpresasConUsuario`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const empresasNormalizadas: Empresa[] = res.data
            .filter((u) => u.empresa)
            .map((u) => ({
              _id: u.empresa!._id,
              nombre: u.empresa!.nombre,
              email: u.empresa!.email,
              telefono: u.empresa!.telefono,
              horario_apertura: u.empresa!.horario_apertura,
              horario_cierre: u.empresa!.horario_cierre,
              costo_envio: u.empresa!.costo_envio,
            }));
          setEmpresas(empresasNormalizadas);
        } else {
          const res = await axios.get<Empresa[]>(`${API_URL}/Api/GetEmpresas`);
          setEmpresas(res.data || []);
        }
      } catch (err) {
        console.error("Error cargando empresas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [user, token, navigate]);

  useEffect(() => {
    if (!user || user.role !== "empresa" || !token) return;

    const fetchPedidosEmpresa = async () => {
      setLoading(true);
      try {
        const empresaId = user.empresa?._id;
        if (!empresaId) return;
        const res = await axios.get<Pedido[]>(
          `${API_URL}/Api/GetPedidosByEmpresa/${empresaId}`,
          { headers: { authorization: `Bearer ${token}`, role: "empresa" } }
        );

        const pedidosNormalizados: Pedido[] = res.data.map((p) => ({
          _id: p._id,
          clienteNombre: p.id_cliente?.nombre || "Cliente desconocido",
          total: p.total || 0,
          estado: (p.estado as EstadoPedido) || "pendiente",
          createdAt: p.createdAt,
        }));

        setPedidos(pedidosNormalizados);
      } catch (err) {
        console.error("Error cargando pedidos de la empresa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosEmpresa();
  }, [user, token]);

  useEffect(() => {
    if (empresas.length === 0) return;

    const loadImagesFromPexels = async () => {
      try {
        const nuevasImagenes: { [key: string]: string } = {};
        await Promise.all(
          empresas.map(async (empresa) => {
            const query = empresa.nombre || "restaurant";
            const res = await axios.get<PexelsResponse>(
              "https://api.pexels.com/v1/search",
              {
                headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY },
                params: { query, per_page: 5 },
              }
            );

            const fotos = res.data.photos;
            if (fotos && fotos.length > 0) {
              const index = Math.floor(Math.random() * fotos.length);
              nuevasImagenes[empresa._id] = fotos[index].src.large;
            } else {
              nuevasImagenes[empresa._id] = genericRestaurantImage;
            }
          })
        );
        setImagenes(nuevasImagenes);
      } catch (error) {
        console.error("Error cargando imágenes de Pexels", error);
      }
    };

    loadImagesFromPexels();
  }, [empresas]);

  const toggleFavorito = (id: string) =>
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const empresasFiltradas = empresas.filter((e) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower || e.nombre.toLowerCase().includes(searchLower) || false;

    let matchesOpen = true;
    if (filterOpen) {
      const horaActual = new Date().getHours();
      const apertura = parseInt(e.horario_apertura?.split(":")[0] || "0");
      const cierre = parseInt(e.horario_cierre?.split(":")[0] || "24");
      const abierto =
        apertura > cierre
          ? horaActual >= apertura || horaActual < cierre
          : horaActual >= apertura && horaActual < cierre;
      matchesOpen = filterOpen === "open" ? abierto : !abierto;
    }

    return matchesSearch && matchesOpen;
  });

  const empresasFavoritas = empresas.filter((e) => favoritos.includes(e._id));

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-4 py-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl text-yellow-400 font-semibold hidden sm:block">
            Altoque
          </h1>
        </div>

        <div className="flex items-center gap-3 relative">
          {user?.role === "empresa" ? (
            <div className="flex gap-3">
              <button
                className="bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-green-300 transition-colors text-sm"
                onClick={() => {
                  const id = user?.empresa?._id;
                  navigate(`/historial/${id}`, { state: { tipo: user?.role } });
                }}
              >
                Mis Pedidos
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-blue-700 transition-colors text-sm"
                onClick={() =>
                  navigate(`/productos/${user.empresa?._id}`, {
                    state: { tipo: "empresa" },
                  })
                }
              >
                Administrar Productos
              </button>
            </div>
          ) : (
            <button
              className="bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-green-300 transition-colors text-sm"
              onClick={() => {
                const id = user?.cliente?._id;
                navigate(`/historial/${id}`, { state: { tipo: user?.role } });
              }}
            >
              Mis Pedidos
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 bg-yellow-400 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              <FaUserCircle size={20} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-yellow-50 text-gray-700"
                  onClick={() => navigate("/profile")}
                >
                  Mi perfil
                </button>
                {user?.name !== "Invitado" ? (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-50 text-gray-700"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-50 text-gray-700"
                    onClick={handleLogin}
                  >
                    Iniciar sesión
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 flex-1">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
          Bienvenido,{" "}
          <span className="text-yellow-400 font-semibold">
            {user?.name || user?.email || "Invitado"}
          </span>
        </h2>
        {pedidoMensaje && (
          <div className="fixed top-24 right-10 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start gap-3 w-80 animate-slide-in z-50">
            <div className="flex-1">
              <p className="font-semibold">{pedidoMensaje}</p>
              {state?.tiempoEstimado && state?.horaListo && (
                <p className="text-sm">
                  Tiempo estimado: {state.tiempoEstimado} min - Listo a las{" "}
                  {state.horaListo}
                </p>
              )}
            </div>
          </div>
        )}

        {user?.role !== "empresa" && (
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            {/*
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="pizzeria">Pizzerías</option>
              <option value="hamburgueseria">Hamburgueserías</option>
              <option value="heladeria">Heladerías</option>
            </select>
*/}
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onChange={(e) => setFilterOpen(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="open">Abierto ahora</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>
        )}

        {user?.role === "empresa" && (
          <div className="flex flex-col gap-6">
            <EstadisticasEmpresa pedidos={pedidos} />

            <h3 className="text-lg font-semibold text-gray-800">
              Pedidos recientes
            </h3>

            {loading ? (
              <p>Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <p>No hay pedidos aún</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido._id}
                    className="bg-white shadow rounded-xl p-4"
                  >
                    <p className="text-gray-500 text-sm">
                      Cliente: {pedido.id_cliente?.nombre}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Total: ${pedido.total?.toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Estado: {pedido.estado}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Fecha:{" "}
                      {pedido.createdAt
                        ? new Date(pedido.createdAt).toLocaleString()
                        : "Fecha no disponible"}
                    </p>

                    <PedidoDashboardBar
                      pedido={{
                        ...pedido,
                        estado: (pedido.estado as EstadoPedido) || "pendiente",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user?.role !== "empresa" && (
          <>
            {empresasFavoritas.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Tus Favoritos
                </h3>
                <div className="flex gap-4 overflow-x-auto">
                  {empresasFavoritas.map((f) => (
                    <EmpresaCard
                      key={f._id}
                      empresa={f}
                      imagen={imagenes[f._id] || genericRestaurantImage}
                      favorito={true}
                      onFavorite={toggleFavorito}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && empresasFiltradas.length === 0 && (
              <p className="text-gray-500 text-center py-10">
                No se encontraron empresas que coincidan con tu búsqueda.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {!loading &&
                empresasFiltradas.map((item) => (
                  <EmpresaCard
                    key={item._id}
                    empresa={item}
                    imagen={imagenes[item._id] || genericRestaurantImage}
                    favorito={favoritos.includes(item._id)}
                    onFavorite={toggleFavorito}
                  />
                ))}
            </div>
          </>
        )}
      </main>

      {showGuestToast && (
        <div className="fixed top-24 right-10 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg flex items-start gap-3 w-80 animate-slide-in z-50">
          <svg
            className="w-6 h-6 flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Estás navegando como invitado</p>
            <p className="text-sm text-gray-700">
              Para ver tus pedidos y obtener una mejor experiencia, inicia
              sesión en tu cuenta.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
