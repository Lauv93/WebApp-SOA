import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Pets from './pages/Pets'
import Navbar from './components/Navbar'
import Appointments from './pages/Appointments'
import Documents from './pages/Documents'
import Budget from './pages/Budget'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </main>
    </div>
  )
}
