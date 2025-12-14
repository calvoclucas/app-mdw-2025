import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";
import type { RootState, AppDispatch } from "../app/store.js";
import axios from "axios";
import logo from "../assets/logo_altoque.png";
import { FaUserCircle, FaArrowLeft, FaTrashAlt, FaKey, FaEdit } from "react-icons/fa";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MiPerfil: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [section, setSection] = useState<"datos" | "password" | "borrar">("datos");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
const [confirmPassword, setConfirmPassword] = useState(""); 
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleUpdateData = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/Api/UpdateUser`, { name, lastName, email });
      showToast("success", "Datos actualizados correctamente!");
    } catch (err) {
      console.error(err);
      showToast("error", "Error actualizando datos");
    } finally {
      setLoading(false);
    }
  };

const handleChangePassword = async () => {
  if (!password || !newPassword || !confirmPassword) {
    showToast("error", "Complete todos los campos de contraseña");
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast("error", "La nueva contraseña y la confirmación no coinciden");
    return;
  }

  setLoading(true);
  try {
    await axios.put(`${API_URL}/Api/ChangePassword`, { password, newPassword });
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("success", "Contraseña cambiada correctamente!");
  } catch (err) {
    console.error(err);
    showToast("error", "Error cambiando contraseña");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteAccount = async () => {
    if (!confirm("¿Desea confirmar la eliminación de su cuenta? Esta acción es irreversible.")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/Api/DeleteUser`);
      showToast("success", "Cuenta eliminada");
      handleLogout();
    } catch (err) {
      console.error(err);
      showToast("error", "Error eliminando la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const isGuest = user?.name === "Invitado";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-4 py-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl text-yellow-400 font-semibold hidden sm:block">Altoque</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-yellow-400 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-yellow-500 transition hover:cursor-pointer"
        >
          <FaArrowLeft /> Volver
        </button>
      </header>

      <main className="flex flex-1 px-4 sm:px-6 py-6">
        <aside className="w-64 bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-6">
          <FaUserCircle className="text-yellow-400 text-6xl" />
          <p className="font-semibold">{user?.name || "Invitado"}</p>

          {!isGuest && (
            <>
              <button
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-yellow-50 hover:cursor-pointer transition ${
                  section === "datos" ? "bg-yellow-100 font-semibold" : ""
                }`}
                onClick={() => setSection("datos")}
              >
                <FaEdit /> Mis Datos
              </button>
              <button
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-yellow-50 transition ${
                  section === "password" ? "bg-yellow-100 font-semibold" : ""
                }`}
                onClick={() => setSection("password")}
              >
                <FaKey /> Cambiar Contraseña
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 hover:cursor-pointer transition"
                onClick={() => setSection("borrar")}
              >
                <FaTrashAlt /> Borrar Cuenta
              </button>
            </>
          )}

          {isGuest && (
            <div className="flex flex-col gap-2 w-full items-center text-center">
              <p className="text-gray-600 text-sm">Necesitas iniciar sesión para gestionar tu cuenta</p>
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:cursor-pointer transition w-full"
                onClick={() => navigate("/login")}
              >
                Ir al login
              </button>
            </div>
          )}
        </aside>

        <section className="flex-1 bg-white rounded-xl shadow-md p-6 ml-6 flex flex-col gap-6">
          {!isGuest && section === "datos" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">Mis Datos</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleUpdateData}
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition w-40 hover:cursor-pointer"
              >
                Guardar
              </button>
            </div>
          )}

          {!isGuest && section === "password" && (
  <div className="flex flex-col gap-4">
    <h2 className="text-2xl font-semibold text-gray-800">Cambiar Contraseña</h2>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Contraseña actual"
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="Nueva contraseña"
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirmar nueva contraseña"
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
    <button
      onClick={handleChangePassword}
      className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:cursor-pointer transition w-40"
    >
      Cambiar
    </button>
  </div>
)}


          {!isGuest && section === "borrar" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 text-red-600 ">Borrar Cuenta</h2>
              <p className="text-gray-600">Esta acción es irreversible. Tu cuenta se eliminará permanentemente.</p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 hover:cursor-pointer transition w-48"
              >
                Confirmar eliminación
              </button>
            </div>
          )}
        </section>
      </main>

      {toastMessage && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded shadow-lg text-white z-50 transition-all duration-300
            ${toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toastMessage.text}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MiPerfil;
