import React from "react";
import Card from "../components/Card";

const Dashboard: React.FC = () => {
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
          badge="0 mascotas"
          emoji="🐶"
          link="/pets"
        />

        <Card
          title="Citas"
          subtitle="Programa y consulta citas veterinarias"
          badge="0 citas"
          emoji="📅"
          link="/appointments"
        />

        <Card
          title="Documentos"
          subtitle="Almacena certificados y archivos"
          badge="0 documentos"
          emoji="📄"
          link="/documents"
        />

        <Card
          title="Presupuestos"
          subtitle="Administra gastos de tus mascotas"
          badge="0 presupuestos"
          emoji="💰"
          link="/budgets"
        />
      </div>

      {/* Bloque de próximas citas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Próximas Citas</h2>
        <div className="text-center text-gray-500 py-8">No hay citas aún</div>
      </div>
    </div>
  );
};

export default Dashboard;
