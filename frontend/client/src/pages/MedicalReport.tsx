import React from "react";
import { useMedicalRecords } from "../hooks/useMedicalRecords";
import CreateMedicalRecordModal from "../components/CreateMedicalRecordModal";

const MedicalRecords: React.FC = () => {
  const {
    records,
    pets,
    loading,
    showCreate,
    setShowCreate,
    loadRecords,
    handleDelete,
  } = useMedicalRecords();

  // Evitar duplicados por id
  const uniqueRecords = records.filter(
    (record, index, self) => 
      index === self.findIndex(r => r.id === record.id)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Historial Médico</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCreate(true)}
      >
        + Crear Registro
      </button>

      {loading ? (
        <p className="text-gray-600">Cargando registros...</p>
      ) : uniqueRecords.length === 0 ? (
        <p className="text-gray-600">No hay registros médicos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueRecords.map((r, index) => (
            <div key={`${r.id}-${index}`} className="border p-3 rounded shadow">
              <p><strong>Mascota:</strong> {r.pet_name}</p>
              <p><strong>Tratamiento:</strong> {r.treatment}</p>
              <p><strong>Fecha:</strong> {new Date(r.date).toLocaleDateString()}</p>
              <button
                className="text-red-600 mt-2"
                onClick={() => handleDelete(r.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateMedicalRecordModal
          onClose={() => setShowCreate(false)}
          onCreated={loadRecords}
          pets={pets}
        />
      )}
    </div>
  );
};

export default MedicalRecords;
