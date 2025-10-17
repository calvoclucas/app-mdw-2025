import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../assets/logo_altoque.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("cliente");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const apiResponse = await axios.post(
        "http://localhost:3001/Api/RegisterUser",
        {
          email,
          name,
          lastName,
          role,
        }
      );

      console.log("API Response:", apiResponse.data);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      toast.success("¡Registrado correctamente!", { duration: 3000 });
      navigate("/");
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.error || "Error al registrar en el servidor"
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-xl transform transition duration-500 hover:scale-105"
      >
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-40 h-auto object-contain" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Registrarse
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          <option value="cliente">Cliente</option>
          <option value="empresa">Empresa</option>
        </select>

        <button
          type="submit"
          className="w-full text-white p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition font-semibold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
