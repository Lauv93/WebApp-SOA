import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Importamos nuestra conexión al backend

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await api.post("/users/register", {
        name,
        email,
        password,
      });

      alert("Registro exitoso");
      navigate("/login");

    } catch (err: any) {
      alert(err.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Cuenta 🐾</h1>

        <form onSubmit={handleRegister}>
          <label className="block mb-2 font-medium">Nombre Completo</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
