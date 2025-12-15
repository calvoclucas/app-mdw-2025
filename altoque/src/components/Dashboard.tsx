import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import type { RootState, AppDispatch } from "../app/store.js";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo_altoque.png";
import Footer from "../components/Footer";

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

const API_URL = import.meta.env.VITE_BACKEND_URL;

const genericRestaurantImage =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

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

const EmpresaCard: React.FC<{
  empresa: Empresa;
  imagen: string;
  onFavorite?: (id: string) => void;
  favorito?: boolean;
}> = ({ empresa, imagen, onFavorite, favorito }) => {
  const navigate = useNavigate();

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
    navigate(`/empresa/${empresa._id}`);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-md border border-gray-100 m-4 cursor-pointer relative"
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
        <div className="absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 text-xs font-semibold rounded-full shadow">
          Envío: ${empresa.costo_envio?.toFixed(2) || "0.00"}
        </div>
        {onFavorite && (
          <button
            className={`absolute top-2 right-2 text-lg p-1 rounded-full ${
              favorito ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-500 transition`}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(empresa._id);
            }}
          >
            ★
          </button>
        )}
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
  );
};

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as { mensaje?: string } | undefined;

  const [pedidoMensaje, setPedidoMensaje] = useState(state?.mensaje || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
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
  const isGuest = user?._id === "guest";

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
          console.log("Datos invitado:", res.data);
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
          <button
            className="bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-green-300 transition-colors text-sm hover:cursor-pointer"
            onClick={() => {
              const id =
                user?.role === "empresa"
                  ? user?.empresa?._id
                  : user?.cliente?._id;
              navigate(`/historial/${id}`, { state: { tipo: user?.role } });
            }}
          >
            Mis Pedidos
          </button>
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

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

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

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
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
