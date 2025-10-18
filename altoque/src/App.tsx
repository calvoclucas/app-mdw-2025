import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CheckoutPedido from "./components/CheckoutPedido";
import ProductsEmpresa from "./components/ProductsEmpresa";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empresa/:id" element={<ProductsEmpresa />} />
        <Route path="/checkout" element={<CheckoutPedido />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
