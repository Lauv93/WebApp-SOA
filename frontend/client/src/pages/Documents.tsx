import React from "react";

const Documents: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Documentos</h1>
      <p className="text-gray-600 mb-6">Sube y administra los documentos de tus mascotas.</p>

      <div className="bg-white p-4 rounded shadow">
        No hay documentos cargados.
      </div>
    </div>
  );
};

export default Documents;
