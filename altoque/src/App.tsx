import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CheckoutPedido from "./components/CheckoutPedido";
import ProductsEmpresa from "./components/ProductsEmpresa";
import Historiales from "./components/Historiales";
import Productos from "./components/ABMProductos";
import SobreNosotros from "./components/SobreNosotros";
import Contacto from "./components/contacto";
import FAQ from "./components/FAQ";
import MiPerfil from "./components/MiPerfil";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empresa/:id" element={<ProductsEmpresa />} />
        <Route path="/checkout" element={<CheckoutPedido />} />
        <Route path="/historial/:id" element={<Historiales />} />
        <Route path="/productos/:id" element={<Productos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<SobreNosotros />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/profile" element={<MiPerfil/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
