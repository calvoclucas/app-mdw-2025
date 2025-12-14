import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import logo from "../assets/logo_altoque.png";

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
        <img src={logo} alt="Altoque Logo" className="w-14 h-14" />
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition hover:cursor-pointer"
        >
          Volver al Dashboard
        </button>
      </header>

      <main className="flex-1 px-6 py-10 flex flex-col justify-center max-w-7xl mx-auto gap-8">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
          <div className="flex-1 flex flex-col justify-top gap-6">
            <h1 className="text-3xl font-bold text-yellow-400 mt-5">Contáctanos</h1>
            <p className="text-gray-700 text-lg">
              ¿Tenés dudas, sugerencias o querés hablar con nosotros? Nuestro
              equipo está listo para ayudarte. Podés contactarnos por cualquiera de
              estos medios o dejarnos un mensaje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center gap-2">
                <FaPhoneAlt className="text-yellow-400 text-2xl" />
                <h3 className="font-semibold text-gray-800">Teléfono</h3>
                <p className="text-gray-600 text-sm">+54 9 1234 5678</p>
              </div>

              <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center gap-2">
                <FaEnvelope className="text-yellow-400 text-2xl" />
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600 text-sm">soporte@altoque.com</p>
              </div>

              <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400 text-2xl" />
                <h3 className="font-semibold text-gray-800">Dirección</h3>
                <p className="text-gray-600 text-sm">Av. Pellegrini 1192, Rosario</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white shadow-lg rounded-xl p-6 flex flex-col justify-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Envíanos un mensaje</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Tu nombre"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              />
              <input
                type="email"
                placeholder="Tu email"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              />
              <textarea
                placeholder="Escribí tu mensaje..."
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full h-32 resize-none"
              ></textarea>
              <button
                type="submit"
                className="bg-yellow-400 text-white font-semibold px-4 py-3 rounded-full hover:bg-yellow-500 transition w-full mt-2 hover:cursor-pointer"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
