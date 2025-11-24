import React from "react";
import { MedicalRecord } from "../hooks/useMedicalRecords";

interface MedicalRecordCardProps {
  record: MedicalRecord;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
  record,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
      <h3 className="font-bold text-lg">{record.pet_name}</h3>
      <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</p>
      <p><strong>Descripción:</strong> {record.description}</p>
      <p><strong>Tratamiento:</strong> {record.treatment}</p>

      {isAdmin && (
        <div className="flex gap-2 mt-2">
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded"
            onClick={onEdit}
          >
            Editar
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={onDelete}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordCard;
