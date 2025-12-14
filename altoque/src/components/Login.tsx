import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, AppUser } from "../features/auth/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../app/store";
import logo from "../assets/logo_altoque.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface LoginResponse {
  message: string;
  user: {
    firebaseUid?: string;
    email: string;
    name: string;
    lastName: string;
    role?: "cliente" | "empresa";
    _id?: string;
    empresa?: {
      _id: string;
      nombre: string;
    };
    cliente?: {
      _id: string;
      nombre: string;
      puntos: number;
    };
  };
  token?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    const guestUser: AppUser = {
      _id: "guest",
      firebaseUid: "guest",
      email: "invitado@altoque.app",
      name: "Invitado",
      lastName: "",
      role: "cliente",
    };

    dispatch(login(guestUser));
    navigate("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const { data } = await axios.post<LoginResponse>(
        `${API_URL}/api/login`,
        { token }
      );

      const appUser: AppUser = {
        firebaseUid: data.user.firebaseUid || firebaseUser.uid,
        email: data.user.email,
        name: data.user.name,
        lastName: data.user.lastName,
        role: data.user.role as "cliente" | "empresa",
        _id: data.user._id,
        empresa: data.user.empresa,
        cliente: data.user.cliente,
      };

      dispatch(login(appUser));
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-sm transform transition duration-500 hover:scale-105"
      >
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-auto object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">
            {error}
          </p>
        )}

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

        <button
          type="submit"
          className="w-full text-white p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition font-semibold hover:cursor-pointer "
        >
          Iniciar Sesión
        </button>

        <p className="mt-4 text-center text-sm">
          ¿No tenés cuenta?{" "}
          <a
            href="/register"
            className="text-purple-600 font-semibold hover:underline hover:text-purple-500"
          >
            Registrate
          </a>
        </p>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="text-purple-600 font-semibold underline mt-4 w-full text-center text-sm hover:cursor-pointer hover:text-purple-500"
        >
          Ingresar como invitado
        </button>
      </form>
    </div>
  );
};

export default Login;
