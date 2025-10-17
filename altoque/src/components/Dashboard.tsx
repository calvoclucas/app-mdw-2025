import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../app/store";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import logo from "../assets/logo_altoque.png";

type EmpresaConUsuario = {
  _id: string;
  email: string;
  empresa?: {
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

const PEXELS_API_KEY =
  "98wsW3Lz2EksK7lRz804KqoiI9oVtTpOlABCTnzJoQXMTzimzuIrLbzk";

const genericRestaurantImage =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const genericFoodImage =
  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const empresaIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const fetchLogoFromLogoDev = (companyName: string): string | null => {
  if (companyName.toLowerCase().includes("mcdonald's")) {
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
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-300 rounded-t-3xl"></div>{" "}
    <div className="p-5 flex flex-col gap-3">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-48 bg-gray-300 rounded-b-3xl mt-2"></div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
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
            let imageUrl: string | null = null;

            imageUrl = fetchLogoFromLogoDev(nombreEmpresa);
            if (!imageUrl) {
              imageUrl = await fetchImageFromPexels(
                nombreEmpresa,
                PEXELS_API_KEY
              );
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
      <header className="bg-white shadow-lg flex items-center justify-between px-4 sm:px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          <h1 className="text-3xl text-yellow-400 hidden sm:block">Altoque</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-red-700 transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="px-4 sm:px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
          Bienvenido,{" "}
          <span className="text-yellow-400 font-bold">
            {user?.displayName || user?.email || "Usuario"}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                  if (apertura > cierre) {
                    return horaActual >= apertura || horaActual < cierre;
                  }
                  return horaActual >= apertura && horaActual < cierre;
                })();

                const imgSrc = imagenes[item._id] || genericRestaurantImage;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl relative border border-gray-100"
                  >
                    <div className="relative">
                      <img
                        src={imgSrc}
                        alt={item.empresa?.nombre || "Empresa"}
                        className="w-full h-56 object-cover rounded-t-3xl transition duration-300 hover:opacity-90"
                        onError={(e) => {
                          e.currentTarget.src = genericRestaurantImage;
                        }}
                      />
                      <div className="absolute inset-0  bg-opacity-20 rounded-t-3xl"></div>

                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                          abiertoAhora
                            ? "bg-green-600 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {abiertoAhora
                          ? `ABIERTO | Cierra ${item.empresa?.horario_cierre}`
                          : `CERRADO | Abre ${item.empresa?.horario_apertura}`}
                      </span>

                      <span className="absolute bottom-3 right-3 bg-white text-gray-800 px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                        Envío: ${item.empresa?.costo_envio.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-2">
                      <h3 className="text-2xl font-extrabold text-gray-900 truncate">
                        {item.empresa?.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {item.empresa?.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l1.3 9.135a1 1 0 01-.842 1.127l-2.006.398a1 1 0 00-.77.894v2.022c0 .554.446 1 1 1h8c.554 0 1-.446 1-1v-2.022a1 1 0 00-.77-.894l-2.006-.398a1 1 0 01-.842-1.127l1.3-9.135A1 1 0 0114.847 2H17a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                        </svg>
                        {item.empresa?.telefono}
                      </p>
                      {item.direccion && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-500"
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
                      <MapContainer
                        center={[
                          item.direccion.coordenadas.lat,
                          item.direccion.coordenadas.lng,
                        ]}
                        zoom={16}
                        scrollWheelZoom={false}
                        className="w-full h-48 rounded-b-3xl overflow-hidden border-t border-gray-200"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
