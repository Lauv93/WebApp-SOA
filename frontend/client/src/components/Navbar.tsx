import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      
      {/* LOGO DE TEXTO QUE REDIRIGE AL HOME */}
      <Link
        to="/"
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
      >
        <span className="text-3xl">🐾</span>
        <span>PetCare</span>
      </Link>

      {/* ACCIONES DERECHA */}
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="text-gray-700 hover:text-gray-900 transition"
        >
          Perfil
        </Link>

        <button
          onClick={() => {
            // Aquí pones la lógica real de logout luego si lo deseas
            // Por ahora solo redirige al login
            window.location.href = "/login";
          }}
          className="text-red-600 hover:text-red-800 transition"
        >
          Cerrar sesión
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
