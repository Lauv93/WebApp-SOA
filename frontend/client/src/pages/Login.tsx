import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Inicio de sesión exitoso");
      navigate("/");

    } catch (err: any) {
      alert(err.response?.data?.error || "Error al iniciar sesión");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">PetCare 🐾</h1>

        <form onSubmit={handleLogin}>
          <label className="block mb-2 font-medium">Correo</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-6"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
