import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import type { RootState, AppDispatch } from "../app/store.js";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import logo from "../assets/logo_altoque.png";
import { useLocation } from "react-router-dom";

type EmpresaConUsuario = {
  _id: string;
  email: string;
  empresa?: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
    horario_apertura: string;
    horario_cierre: string;
    costo_envio: number;
  };
  direccion?: {
    calle: string;
    numero: number;
    ciudad: string;
    provincia: string;
    cp: string;
    coordenadas: { lat: number; lng: number };
  };
};

interface PexelsPhoto {
  photos: Array<{
    src: {
      large2x: string;
    };
  }>;
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
  if (companyName.toLowerCase().includes("Donald")) {
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

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as
    | {
        mensaje?: string;
        tiempoEstimado?: number;
        horaListo?: string;
      }
    | undefined;

  const [pedidoMensaje, setPedidoMensaje] = useState(state?.mensaje || "");
  const [tiempoEstimado, setTiempoEstimado] = useState(state?.tiempoEstimado);
  const [horaListo, setHoraListo] = useState(state?.horaListo);

  useEffect(() => {
    if (state?.mensaje) {
      const timeout = setTimeout(() => setPedidoMensaje(""), 8000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<EmpresaConUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    setLoading(true);
    axios
      .get<EmpresaConUsuario[]>(
        "http://localhost:3001/Api/GetEmpresasConUsuario"
      )
      .then(async (res) => {
        setEmpresas(res.data);
        const nuevasImagenes: { [key: string]: string } = {};
        await Promise.all(
          res.data.map(async (empresa) => {
            const nombreEmpresa = empresa.empresa?.nombre || "";
            let imageUrl = fetchLogoFromLogoDev(nombreEmpresa);
            if (!imageUrl) {
              imageUrl = await fetchImageFromPexels(nombreEmpresa, API_KEY);
            }
            nuevasImagenes[empresa._id] = imageUrl;
          })
        );
        setImagenes(nuevasImagenes);
      })
      .catch((err) =>
        console.error("Error al cargar empresas o imágenes:", err)
      )
      .then(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl text-yellow-400 font-semibold hidden sm:block">
            Altoque
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm hover:bg-red-700 transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="px-4 sm:px-6 py-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-5">
          Bienvenido,{" "}
          <span className="text-yellow-400 font-semibold">
            {user?.name || user?.email || "Usuario"}
          </span>
        </h2>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : empresas.map((item) => {
                const abiertoAhora = (() => {
                  if (!item.empresa) return false;
                  const horaActual = new Date().getHours();
                  const apertura = parseInt(
                    item.empresa.horario_apertura.split(":")[0]
                  );
                  const cierre = parseInt(
                    item.empresa.horario_cierre.split(":")[0]
                  );
                  if (apertura > cierre)
                    return horaActual >= apertura || horaActual < cierre;
                  return horaActual >= apertura && horaActual < cierre;
                })();
                const imgSrc = imagenes[item._id] || genericRestaurantImage;

                return (
                  <div
                    key={item._id}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-md border border-gray-100 m-8 cursor-pointer"
                    onClick={() =>
                      item.empresa?._id &&
                      navigate(`/empresa/${item.empresa._id}`)
                    }
                  >
                    <div className="relative">
                      <img
                        src={imgSrc}
                        alt={item.empresa?.nombre || "Empresa"}
                        className="w-full h-36 object-cover transition duration-300 hover:opacity-90"
                        onError={(e) => {
                          e.currentTarget.src = genericRestaurantImage;
                        }}
                      />
                      <div
                        className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full shadow-md text-white`}
                        style={{
                          backgroundColor: abiertoAhora ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {abiertoAhora
                          ? `ABIERTO | Cierra ${item.empresa?.horario_cierre}`
                          : `CERRADO | Abre ${item.empresa?.horario_apertura}`}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 text-xs font-semibold rounded-full shadow">
                        Envío: ${item.empresa?.costo_envio.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-2 text-sm">
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-yellow-500 transition-colors">
                        {item.empresa?.nombre}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {item.empresa?.email}
                      </p>
                      {item.empresa?.telefono && (
                        <p className="text-gray-600 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l1.3 9.135a1 1 0 01-.842 1.127l-2.006.398a1 1 0 00-.77.894v2.022c0 .554.446 1 1 1h8c.554 0 1-.446 1-1v-2.022a1 1 0 00-.77-.894l-2.006-.398a1 1 0 01-.842-1.127l1.3-9.135A1 1 0 0114.847 2H17a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                          </svg>
                          {item.empresa?.telefono}
                        </p>
                      )}
                      {item.direccion && (
                        <p className="text-gray-600 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item.direccion.calle} {item.direccion.numero},{" "}
                          {item.direccion.ciudad} ({item.direccion.provincia})
                        </p>
                      )}
                    </div>

                    {item.direccion?.coordenadas && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <MapContainer
                          center={[
                            item.direccion.coordenadas.lat,
                            item.direccion.coordenadas.lng,
                          ]}
                          zoom={16}
                          scrollWheelZoom={false}
                          className="w-full h-36 rounded-b-xl overflow-hidden border-t border-gray-200"
                        >
                          <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                          />
                          <Marker
                            position={[
                              item.direccion.coordenadas.lat,
                              item.direccion.coordenadas.lng,
                            ]}
                            icon={empresaIcon}
                          >
                            <Popup>{item.empresa?.nombre}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
