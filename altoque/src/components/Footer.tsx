import React from "react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white shadow-inner py-6 mt-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Altoque. Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          <button
            className="text-gray-600 hover:text-yellow-500 text-sm hover:cursor-pointer"
            onClick={() => navigate("/about")}
          >
            Sobre nosotros
          </button>
          <button
            className="text-gray-600 hover:text-yellow-500 text-sm hover:cursor-pointer"
            onClick={() => navigate("/contact")}
          >
            Contacto
          </button>
          <button
            className="text-gray-600 hover:text-yellow-500 text-sm hover:cursor-pointer"
            onClick={() => navigate("/faq")}
          >
            FAQ
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
