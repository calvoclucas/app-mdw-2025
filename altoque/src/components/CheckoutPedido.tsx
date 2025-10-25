import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import FakeCardForm from "./FakeCardForm";
import {
  ShoppingBag,
  Store,
  Truck,
  CreditCard,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

interface PedidoCreado {
  _id: string;
}

interface ProductoCarrito {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  id_empresa: string;
}

interface MetodoPago {
  _id: string;
  tipo: string;
}

interface LocationState {
  carrito?: ProductoCarrito[];
  total?: number;
  empresaId?: string;
}

interface Direccion {
  _id: string;
  calle?: string;
  numero?: string;
  ciudad?: string;
}

const CheckoutPedido: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const carrito = state?.carrito ?? [];
  const total = state?.total ?? 0;
  const empresaId = state?.empresaId ?? "";
  const user = useSelector((state: RootState) => state.auth.user);

  const [tipoEntrega, setTipoEntrega] = useState<"retiro" | "domicilio">(
    "retiro"
  );
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMetodosPago = async () => {
      try {
        const { data } = await axios.get<MetodoPago[]>(
          "http://localhost:3001/Api/GetMetodosPago"
        );
        setMetodosPago(data);
        if (data.length > 0) setMetodoPagoSeleccionado(data[0]._id);
      } catch (err) {
        console.error("Error al cargar métodos de pago:", err);
        setError("No se pudieron cargar los métodos de pago");
      } finally {
        setLoading(false);
      }
    };
    cargarMetodosPago();
  }, []);

  const DEFAULT_DIRECCION_ID = "68f1c409f11a42140ab02aa2";

  const obtenerDireccion = async (): Promise<string> => {
    try {
      if (tipoEntrega === "domicilio" && user?.role === "cliente") {
        const res = await axios.get<Direccion>(
          `http://localhost:3001/Api/GetDireccionById/${user._id}`
        );
        if (res.data?._id) return res.data._id;
        console.warn("No se encontró dirección del cliente, usando default");
        return DEFAULT_DIRECCION_ID;
      } else if (tipoEntrega === "retiro" && user?.role === "empresa") {
        const res = await axios.get<Direccion>(
          `http://localhost:3001/Api/GetDireccionById/${user.empresa?._id}`
        );
        if (res.data?._id) return res.data._id;
        console.warn("No se encontró dirección de la empresa, usando default");
        return DEFAULT_DIRECCION_ID;
      }
    } catch (err) {
      console.error("Error al obtener la dirección, usando default:", err);
    }
    return DEFAULT_DIRECCION_ID;
  };
  const handleConfirmarPedido = async () => {
    if (!metodoPagoSeleccionado) {
      alert("Por favor selecciona un método de pago");
      return;
    }

    setProcesando(true);
    setError(null);

    try {
      const id_cliente =
        user?.role === "cliente" ? user.cliente?._id : undefined;
      const id_empresa =
        user?.role === "empresa" ? user.empresa?._id : empresaId;

      if (!id_cliente && user?.role === "cliente")
        throw new Error("No se pudo obtener el ID del cliente");
      if (!id_empresa)
        throw new Error("No se pudo obtener el ID de la empresa");

      const id_direccion = await obtenerDireccion();
      console.log("id_direccion:", id_direccion);
      console.log("id_cliente:", id_cliente);

      const pedidoPayload = {
        id_cliente,
        id_empresa,
        id_metodo_pago: metodoPagoSeleccionado,
        id_direccion,
        total,
        estado: "pendiente",
        tipo_entrega: tipoEntrega,
        tiempo_estimado: 30,
      };

      const { data: pedidoCreado } = await axios.post<PedidoCreado>(
        "http://localhost:3001/Api/CreatePedido",
        pedidoPayload
      );
      console.log("Pedido creado:", pedidoCreado);

      if (!pedidoCreado?._id) {
        throw new Error("El pedido no devolvió un ID válido");
      }

      const detallesPayload = carrito.map((item) => ({
        id_pedido: pedidoCreado._id,
        id_producto: item._id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      }));

      try {
        const { data: detallesCreados } = await axios.post(
          "http://localhost:3001/Api/CreateDetallePedido",
          { detalles: detallesPayload }
        );
      } catch (err) {
        console.error("Error creando detalles:", err);
      }

      await Promise.all(
        carrito.map(async (item) => {
          try {
            const res = await axios.put(
              `http://localhost:3001/Api/EditProducto/${item._id}`,
              {
                $inc: { cantidad: -item.cantidad },
              }
            );
          } catch (error) {
            throw error;
          }
        })
      );

      const ahora = new Date();
      const horaListo = new Date(
        ahora.getTime() + pedidoPayload.tiempo_estimado * 60000
      );

      navigate("/dashboard", {
        state: {
          mensaje: "Tu pedido ya está siendo preparado",
          tiempoEstimado: pedidoPayload.tiempo_estimado,
          horaListo: horaListo.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      });
    } catch (err) {
      console.error("Error al confirmar pedido:", err);
      setError(
        "Hubo un error al procesar tu pedido. Por favor intenta nuevamente."
      );
      alert("Hubo un error al procesar tu pedido. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Volver
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
          Finalizar Pedido
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Confirma los detalles de tu pedido
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">
                Resumen del Pedido
              </h2>
            </div>

            <div className="space-y-3 mb-4">
              {carrito.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.nombre}</p>
                    <p className="text-sm text-gray-600">
                      ${item.precio.toFixed(2)} x {item.cantidad}
                    </p>
                  </div>
                  <p className="font-bold text-orange-600">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-orange-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tipo de Entrega
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setTipoEntrega("retiro")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    tipoEntrega === "retiro"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <Store
                    className={
                      tipoEntrega === "retiro"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }
                    size={24}
                  />
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">Retiro en local</p>
                    <p className="text-sm text-gray-600">
                      Retira tu pedido en el local
                    </p>
                  </div>
                  {tipoEntrega === "retiro" && (
                    <CheckCircle className="text-orange-500" size={24} />
                  )}
                </button>

                <button
                  onClick={() => setTipoEntrega("domicilio")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    tipoEntrega === "domicilio"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <Truck
                    className={
                      tipoEntrega === "domicilio"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }
                    size={24}
                  />
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">
                      Entrega a domicilio
                    </p>
                    <p className="text-sm text-gray-600">
                      Recibe tu pedido en tu dirección
                    </p>
                  </div>
                  {tipoEntrega === "domicilio" && (
                    <CheckCircle className="text-orange-500" size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  Método de Pago
                </h2>
              </div>

              {metodosPago.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay métodos de pago disponibles
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-2">
                    {metodosPago.map((metodo) => (
                      <div key={metodo._id}>
                        <button
                          onClick={() => setMetodoPagoSeleccionado(metodo._id)}
                          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                            metodoPagoSeleccionado === metodo._id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <span className="font-semibold text-gray-800">
                            {metodo.tipo}
                          </span>
                          {metodoPagoSeleccionado === metodo._id && (
                            <CheckCircle
                              className="text-orange-500"
                              size={20}
                            />
                          )}
                        </button>

                        {metodo.tipo.toLowerCase() === "tarjeta" &&
                          metodoPagoSeleccionado === metodo._id && (
                            <div className="mt-3">
                              <FakeCardForm />
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleConfirmarPedido}
            disabled={procesando || !metodoPagoSeleccionado}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {procesando ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                Confirmar Pedido
              </>
            )}
          </button>
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

export default CheckoutPedido;
