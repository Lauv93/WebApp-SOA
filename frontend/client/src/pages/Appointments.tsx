import React from "react";

const Appointments: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Citas</h1>
      <p className="text-gray-600 mb-6">Gestiona las citas veterinarias de tus mascotas.</p>

      <div className="bg-white p-4 rounded shadow">
        No hay citas registradas aún.
      </div>
    </div>
  );
};

export default Appointments;
