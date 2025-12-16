import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppUser, logout, setUser } from "../features/auth/authSlice.js";
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
  const token = localStorage.getItem("token");
  const [section, setSection] = useState<"datos" | "password" | "borrar">("datos");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmPassword, setConfirmPassword] = useState(""); 
  // mis datos
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [phone, setPhone] = useState(user?.cliente?.telefono || "");
  const [openTime, setOpenTime] = useState(user?.empresa?.horario_apertura || "");
  const [closeTime, setCloseTime] = useState(user?.empresa?.horario_cierre || "");
  const [street, setStreet] = useState(user?.direccion?.calle || "");
  const [number, setNumber] = useState(user?.direccion?.numero || "");
  const [city, setCity] = useState(user?.direccion?.ciudad || "");
  const [province, setProvince] = useState(user?.direccion?.provincia || "");
  const [postalCode, setPostalCode] = useState(user?.direccion?.cp || "");

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
    const payload: any = {
      name,
      lastName,
      email,
      address: {
        street,
        number,
        city,
        province,
        postalCode,
      },
    };

    if (role === "cliente") {
      payload.client = { telefono: phone };
    }

    if (role === "empresa") {
      payload.company = {
        openTime,
        closeTime,
      };
    }

    const resp = await axios.put(
      `${API_URL}/Api/EditUser/${user?._id}`,
      payload,
      { headers: { authorization: `Bearer ${token}` } }
    );

    if (resp.status === 200) {
      dispatch(setUser(resp.data as AppUser));
      showToast("success", "Datos actualizados correctamente!");
    }
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
      await axios.put(`${API_URL}/Api/DeleteUser/${user?._id}`);
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
              {/* <button
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-yellow-50 transition ${
                  section === "password" ? "bg-yellow-100 font-semibold" : ""
                }`}
                onClick={() => setSection("password")}
              >
                <FaKey /> Cambiar Contraseña
              </button> */}
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
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-800">Mis Datos</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />

                {role === "cliente" && (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                )}

                {role === "empresa" && (
                  <>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                    />
                  </>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">Dirección</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Calle"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Número"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ciudad"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Provincia"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Código Postal"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 md:col-span-2"
                />
              </div>

              <button
                onClick={handleUpdateData}
                disabled={loading}
                className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition w-fit"
              >
                Guardar cambios
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
