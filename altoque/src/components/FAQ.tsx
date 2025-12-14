import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import logo from "../assets/logo_altoque.png";
import { FaQuestionCircle } from "react-icons/fa";

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const preguntas = [
    {
      q: "¿Cómo hago un pedido?",
      a: "Seleccioná la empresa, elegí los productos y completá el checkout. Recibirás la confirmación por email."
    },
    {
      q: "¿Puedo cancelar un pedido?",
      a: "Sí, solo podés cancelarlo desde tu historial si aún no fue procesado por la empresa."
    },
    {
      q: "¿Cuánto demora la entrega?",
      a: "El tiempo de entrega depende de cada empresa. Lo vas a ver al confirmar tu pedido."
    },
    {
      q: "¿Puedo cambiar mi información de contacto?",
      a: "Sí, podés modificar tus datos desde tu perfil."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <header className="bg-white shadow-sm flex items-center justify-between px-4 py-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl text-yellow-400 font-semibold hidden sm:block">
            Altoque
          </h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-yellow-500 transition hover:cursor-pointer"
        >
          Volver al Dashboard
        </button>
      </header>

      <main className="px-4 sm:px-6 py-8 flex-1 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Preguntas Frecuentes
        </h2>

        <div className="flex flex-col gap-4">
          {preguntas.map((p, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-400">
                <FaQuestionCircle /> {p.q}
              </h3>
              <p className="mt-2 text-gray-700">{p.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
