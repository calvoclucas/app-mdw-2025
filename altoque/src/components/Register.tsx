import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../assets/logo_altoque.png";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    telefono: "",
    role: "cliente",
    calle: "",
    numero: "",
    ciudad: "",
    provincia: "",
    cp: "",
    horario_apertura: "",
    horario_cierre: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const firebaseUid = userCredential.user.uid;

      await axios.post(`${API_URL}/Api/RegisterUser`, {
        firebaseUid,
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        telefono: form.telefono,
        calle: form.calle,
        numero: form.numero,
        ciudad: form.ciudad,
        provincia: form.provincia,
        cp: form.cp,
        horario_apertura: form.role === "empresa" ? form.horario_apertura : undefined,
        horario_cierre: form.role === "empresa" ? form.horario_cierre : undefined,
      });

      toast.success("Registrado correctamente!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-4xl transition hover:scale-[1.01]"
      >
        <div className="flex justify-center ">
          <img src={logo} alt="Logo" className="w-35" />
        </div>

        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800">
          Registrarse
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <input
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="lastName"
              placeholder="Apellido"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Correo"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="telefono"
              placeholder="Teléfono"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <select
              name="role"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="cliente">Cliente</option>
              <option value="empresa">Empresa</option>
            </select>

            {form.role === "empresa" && (
              <>
                <input
                  type="time"
                  name="horario_apertura"
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="time"
                  name="horario_cierre"
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </>
            )}
          </div>

          <div className="space-y-2">
            <input
              name="calle"
              placeholder="Calle"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="numero"
              placeholder="Número"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="ciudad"
              placeholder="Ciudad"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="provincia"
              placeholder="Provincia"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="cp"
              placeholder="Código Postal"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full text-white p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-semibold transition"
          >
            Registrarse
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 w-full text-center text-purple-600 hover:underline"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
