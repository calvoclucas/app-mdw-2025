import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import logo from "../assets/logo_altoque.png";

const SobreNosotros: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
        <img src={logo} alt="Altoque Logo" className="w-14 h-14" />
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition hover:cursor-pointer"
        >
          Volver al Dashboard
        </button>
      </header>

      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src={logo}
            alt="Altoque Logo"
            className="w-40 h-40 object-contain rounded-full shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">
              Sobre Altoque
            </h1>
            <p className="text-gray-700 text-lg mb-4">
              Altoque nació con la misión de conectar a los clientes con sus
              restaurantes favoritos de manera rápida, sencilla y confiable.
            </p>
            <p className="text-gray-700 text-lg">
              Nuestro equipo está compuesto por desarrolladores, diseñadores y
              expertos en logística, trabajando juntos para ofrecer un servicio
              de alta calidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-[1.03] transition-transform flex flex-col items-center gap-3">
            <FaBullseye className="text-yellow-400 text-4xl" />
            <h3 className="font-semibold text-yellow-400 text-xl mb-2">Misión</h3>
            <p className="text-gray-700 text-center">
              Facilitar el acceso a los mejores restaurantes y ofrecer una
              experiencia de pedido rápida y confiable.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-[1.03] transition-transform flex flex-col items-center gap-3">
            <FaEye className="text-yellow-400 text-4xl" />
            <h3 className="font-semibold text-yellow-400 text-xl mb-2">Visión</h3>
            <p className="text-gray-700 text-center">
              Ser la plataforma líder en entrega de comida en línea, reconocida
              por su eficiencia y calidad.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-[1.03] transition-transform flex flex-col items-center gap-3">
            <FaHandshake className="text-yellow-400 text-4xl" />
            <h3 className="font-semibold text-yellow-400 text-xl mb-2">Valores</h3>
            <p className="text-gray-700 text-center">
              Innovación, transparencia, calidad y satisfacción del cliente en
              cada pedido.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNosotros;
