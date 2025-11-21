import React from "react";

const Budget: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Presupuestos</h1>
      <p className="text-gray-600 mb-6">Consulta y gestiona los gastos relacionados con tus mascotas.</p>

      <div className="bg-white p-4 rounded shadow">
        No hay presupuestos registrados.
      </div>
    </div>
  );
};

export default Budget;
