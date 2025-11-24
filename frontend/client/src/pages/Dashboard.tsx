import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import api from "../api/api";

const Dashboard: React.FC = () => {
  const [petCount, setPetCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const petsRes = await api.get("/pets", { headers });
        setPetCount(petsRes.data.length);

        try {
          const apptRes = await api.get("/appointments", { headers });
          setAppointmentCount(apptRes.data.length);
        } catch (_) {}

        try {
          const docRes = await api.get("/reports", { headers });
          setDocumentCount(docRes.data.length);
        } catch (_) {}

      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bienvenido al sistema de cuidado de mascotas
      </p>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Mis Mascotas"
          subtitle="Gestiona el perfil de tus mascotas"
          badge={`${petCount} mascota${petCount <= 1 ? "" : "s"}`}
          emoji="🐶"
          link="/pets"
        />

        <Card
          title="Citas"
          subtitle="Programa y consulta citas veterinarias"
          badge={`${appointmentCount} cita${appointmentCount <= 1 ? "" : "s"}`}
          emoji="📅"
          link="/appointments"
        />

        <Card
          title="Reportes Medicos"
          subtitle="Almacena reportes medicos"
          badge={`${documentCount} reportes medicos`}
          emoji="📄"
          link="/reports"
        />
      </div>

      {/* Bloque de próximas citas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recordatorios</h2>
        <div className="text-center text-gray-500 py-8">Todo al día</div>
      </div>
    </div>
  );
};

export default Dashboard;
