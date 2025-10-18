import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Plus, Minus, ArrowLeft, Package, X } from "lucide-react";

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  id_empresa: string;
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

interface PexelsPhoto {
  photos: Array<{
    src: {
      medium: string;
    };
  }>;
}

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const genericFoodImage =
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400";

const fetchImageFromPexels = async (
  productName: string,
  apiKey: string
): Promise<string> => {
  const query = `${productName} food`;
  try {
    const response = await axios.get<PexelsPhoto>(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      { headers: { Authorization: apiKey } }
    );
    if (response.data.photos?.[0]?.src.medium) {
      return response.data.photos[0].src.medium;
    }
  } catch (error) {
    console.warn(`Pexels API error for "${productName}":`, error);
  }
  return genericFoodImage;
};

const ProductosEmpresa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get<Producto[]>(`http://localhost:3001/Api/GetProductosByEmpresa/${id}`)
      .then(async (res) => {
        setProductos(res.data);

        const nuevasImagenes: { [key: string]: string } = {};
        await Promise.all(
          res.data.map(async (producto) => {
            const imageUrl = await fetchImageFromPexels(
              producto.nombre,
              API_KEY
            );
            nuevasImagenes[producto._id] = imageUrl;
          })
        );
        setImagenes(nuevasImagenes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, [id]);

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find((p) => p._id === producto._id);
    if (itemExistente) {
      setCarrito(
        carrito.map((p) =>
          p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setCarritoAbierto(true);
  };

  const quitarDelCarrito = (producto: ProductoCarrito) => {
    const item = carrito.find((p) => p._id === producto._id);
    if (item && item.cantidad === 1) {
      setCarrito(carrito.filter((p) => p._id !== producto._id));
    } else {
      setCarrito(
        carrito.map((p) =>
          p._id === producto._id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
      );
    }
  };

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <button
            onClick={() => setCarritoAbierto(!carritoAbierto)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingCart className="text-orange-500" size={20} />
            <span className="font-bold text-gray-800">{carrito.length}</span>
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl shadow-lg">
            <img
              src="/src/assets/logo_altoque.png"
              alt="AlToque"
              className="h-16 w-16 object-contain rounded-2xl"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">
          Productos Disponibles
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Selecciona tus productos favoritos
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando productos...</p>
          </div>
        )}

        {!loading && productos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
              <Package className="mx-auto mb-4 text-gray-400" size={64} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No hay productos disponibles
              </h2>
              <p className="text-gray-600 mb-6">
                Esta empresa aún no ha agregado productos a su catálogo
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all"
              >
                Explorar otras opciones
              </button>
            </div>
          </div>
        )}

        {!loading && productos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productos.map((prod) => (
              <div
                key={prod._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-orange-100 overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={imagenes[prod._id] || genericFoodImage}
                    alt={prod.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = genericFoodImage;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold px-2 py-1 rounded-full text-xs shadow-lg">
                    ${prod.precio.toFixed(2)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">
                    {prod.nombre}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 h-8">
                    {prod.descripcion}
                  </p>
                  <button
                    onClick={() => agregarAlCarrito(prod)}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-2 px-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg text-xs"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {carritoAbierto && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40"
          onClick={() => setCarritoAbierto(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          carritoAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-white" size={24} />
              <h2 className="text-xl font-bold text-white">Tu Pedido</h2>
            </div>
            <button
              onClick={() => setCarritoAbierto(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {carrito.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 font-medium">
                  Tu carrito está vacío
                </p>
                <p className="text-gray-400 text-sm">
                  Agrega productos para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {carrito.map((p) => (
                  <div
                    key={p._id}
                    className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border-2 border-orange-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 flex-1">
                        {p.nombre}
                      </h3>
                      <span className="text-orange-600 font-bold ml-2">
                        ${(p.precio * p.cantidad).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ${p.precio.toFixed(2)} c/u
                      </span>
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                        <button
                          onClick={() => quitarDelCarrito(p)}
                          className="w-7 h-7 flex items-center justify-center text-red-500 font-bold hover:bg-red-50 rounded-full transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-gray-800 min-w-[24px] text-center">
                          {p.cantidad}
                        </span>
                        <button
                          onClick={() => agregarAlCarrito(p)}
                          className="w-7 h-7 flex items-center justify-center text-green-500 font-bold hover:bg-green-50 rounded-full transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {carrito.length > 0 && (
            <div className="border-t-4 border-orange-400 p-4 bg-white">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => alert("Pedido confirmado 🛵")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                Confirmar Pedido 🛵
              </button>
            </div>
          )}
        </div>
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

export default ProductosEmpresa;
