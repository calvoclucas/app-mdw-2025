import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../app/store";
import axios from "axios";
import logo from "../assets/logo_altoque.png";

type Empresa = {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  horario_apertura: string;
  horario_cierre: string;
  costo_envio: number;
};

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get<Empresa[]>("http://localhost:3001/Api/GetEmpresas")
      .then((res) => setEmpresas(res.data))
      .catch((err) => console.error(err))
      .then(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">Altoque</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Welcome */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Bienvenido, {user?.email} Lucas
        </h2>

        {/* Empresas Grid */}
        {loading ? (
          <p className="text-gray-500">Cargando empresas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {empresas.map((empresa) => (
              <div
                key={empresa._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {empresa.nombre}
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Email:</span> {empresa.email}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {empresa.telefono}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Horario:</span>{" "}
                  {empresa.horario_apertura} - {empresa.horario_cierre}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Costo de envío:</span> $
                  {empresa.costo_envio}
                </p>
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                  Ver pedidos
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
