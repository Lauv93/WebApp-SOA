import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../api/user";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.log("No autenticado");
      }
    }
    fetchUser();
  }, []);

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">

      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
      >
        <span className="text-3xl">🐾</span>
        <span>PetCare</span>
      </Link>

      <div className="flex items-center gap-4">

        {/* Mostrar nombre y rol */}
        {user && (
          <span className="font-medium text-gray-700">
            {user.name}
          </span>
        )}

        {/* BOTÓN LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
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
