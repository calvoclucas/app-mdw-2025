// src/components/Dashboard.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../app/store";
import logo from "../assets/logo_altoque.png";

const restaurants = [
  { name: "La Buena Mesa", type: "Italiana", rating: 4.5 },
  { name: "Sabor Local", type: "Argentina", rating: 4.2 },
  { name: "Veggie Delight", type: "Vegetariana", rating: 4.8 },
  { name: "Taco Fiesta", type: "Mexicana", rating: 4.3 },
];

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-30 h-30 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">Altoque</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Welcome */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Bienvenido, {user?.email}
        </h2>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transform transition cursor-pointer"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-gray-600 mb-2">{restaurant.type}</p>
              <p className="text-yellow-500 font-semibold">
                ⭐ {restaurant.rating}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
