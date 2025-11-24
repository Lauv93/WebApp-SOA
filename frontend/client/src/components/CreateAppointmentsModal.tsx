import React, { useState, useEffect } from "react";
import { createAppointment } from "../api/appointments";
import { getMyPets } from "../api/pets"; // Asegúrate de tener este helper

interface Pet {
  id: number;
  name: string;
}

interface CreateAppointmentModalProps {
  onClose: () => void;
  onCreated: () => void;
  isAdmin: boolean;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  onClose,
  onCreated,
}) => {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [petId, setPetId] = useState<number | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  // Cargar las mascotas del usuario
  useEffect(() => {
    async function loadPets() {
      try {
        const data = await getMyPets();
        setPets(data);
      } catch (err) {
        console.error("Error cargando mascotas:", err);
      }
    }
    loadPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    try {
      await createAppointment({ pet_id: petId, reason, date });
      onCreated();
      onClose();
    } catch (err) {
      console.error("Error creando cita:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Cita</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={petId ?? ""}
            onChange={(e) => setPetId(Number(e.target.value))}
            className="border p-2 rounded"
            required
          >
            <option value="" disabled>
              Selecciona una mascota
            </option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Motivo"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded"
            required
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

export default CreateAppointmentModal;
