// src/components/CreateMedicalRecordModal.tsx
import React, { useState } from "react";
import { Pet } from "../hooks/usePets";
import { createMedicalRecord } from "../api/medicalRecord";

interface CreateMedicalRecordModalProps {
  onClose: () => void;
  onCreated: () => void;
  pets: Pet[];
}

const CreateMedicalRecordModal: React.FC<CreateMedicalRecordModalProps> = ({
  onClose,
  onCreated,
  pets,
}) => {
  const [treatment, setTreatment] = useState("");
  const [weight, setWeight] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [date, setDate] = useState("");
  const [petId, setPetId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    try {
      await createMedicalRecord({ pet_id: petId, treatment, weight, diagnosis, date });
      onCreated();
      onClose();
    } catch (err) {
      console.error("Error creando registro médico:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Registro Médico</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={petId ?? ""}
            onChange={(e) => setPetId(Number(e.target.value))}
            className="border p-2 rounded"
            required
          >
            <option value="">Selecciona una mascota</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tratamiento"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Peso"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Diagnóstico"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMedicalRecordModal;
