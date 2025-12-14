import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { AppUser } from "../features/auth/authSlice";

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_LOCAL_HOST;

interface Producto {
  _id?: string;
  id_empresa: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  retiro_local: boolean;
  cantidad: number;
}

const ABMProducto: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as AppUser;
  const empresaId = user?.empresa?._id;
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [form, setForm] = useState<Producto>({
    id_empresa: empresaId || "",
    nombre: "",
    descripcion: "",
    precio: 0,
    retiro_local: false,
    cantidad: 0,
  });

  const fetchProductos = async () => {
    if (!empresaId) return;
    setLoading(true);
    try {
      const res = await axios.get<Producto[]>(
        `${API_URL}/Api/GetProductosByEmpresa/${empresaId}`
      );
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [empresaId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        await axios.put(
          `${API_URL}/Api/EditProducto/${editingProducto._id}`,
          form
        );
      } else {
        await axios.post(`${API_URL}/Api/CreateProducto`, form);
      }
      setModalOpen(false);
      setEditingProducto(null);
      setForm({
        ...form,
        nombre: "",
        descripcion: "",
        precio: 0,
        retiro_local: false,
      });
      fetchProductos();
    } catch (err) {
      console.error(err);
      setError("Error al guardar producto");
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setForm(producto);
    setModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await axios.delete(`${API_URL}/Api/DeleteProducto/${id}`);
      fetchProductos();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar producto");
    }
  };

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
          Administrar Productos
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Crea, edita o elimina productos de tu empresa
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}

        <button
          onClick={() => setModalOpen(true)}
          className="fixed top-6 right-6 bg-blue-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-all z-50 flex items-center gap-2"
        >
          + Nuevo Producto
        </button>

        {!loading && productos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No hay productos aún
              </h2>
              <p className="text-gray-600 mb-6">
                Tus productos aparecerán aquí una vez que los crees
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all"
              >
                Crear Producto
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md p-4 border border-orange-100 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">{p.nombre}</h3>
                <p className="text-gray-500 text-sm">{p.descripcion}</p>
                <p className="mt-2 font-medium">
                  Precio: ${p.precio.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">
                  Stock disponible: {p.cantidad}
                </p>

                <p className="text-gray-500 text-sm">
                  Retiro en local: {p.retiro_local ? "Sí" : "No"}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1.5 rounded flex justify-center items-center gap-1"
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded flex justify-center items-center gap-1"
                >
                  <Trash size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {editingProducto ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label htmlFor="nombre" className="font-medium mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese el nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="border p-3 rounded text-lg"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="descripcion" className="font-medium mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Ingrese una descripción"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="border p-3 rounded text-lg resize-none h-24"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="precio" className="font-medium mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    placeholder="Ingrese el precio"
                    value={form.precio}
                    onChange={handleChange}
                    className="border p-3 rounded text-lg"
                    min={0}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="cantidad" className="font-medium mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    placeholder="Ingrese la cantidad disponible"
                    value={form.cantidad}
                    onChange={handleChange}
                    className="border p-3 rounded text-lg"
                    min={0}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="retiro_local"
                    name="retiro_local"
                    checked={form.retiro_local}
                    onChange={handleChange}
                  />
                  <label htmlFor="retiro_local" className="font-medium">
                    Retiro en local
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      setEditingProducto(null);
                    }}
                    className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                  >
                    Guardar
                  </button>
                </div>
              </form>
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

export default ABMProducto;
