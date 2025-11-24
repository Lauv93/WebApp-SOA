import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Pets from './pages/Pets'
import Appointments from './pages/Appointments'
import MedicalReport from './pages/MedicalReport'
import Login from './pages/Login'
import Register from './pages/Register'

import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Ocultar navbar en login/register */}
      {!hideNavbar && token && <Navbar />}

      <main className="p-6 max-w-6xl mx-auto">
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <Pets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MedicalReport/>
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
    </div>
  );
}
