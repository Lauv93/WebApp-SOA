import React, { useState } from "react";
import { updateAppointment } from "../api/appointments";
import { Appointment } from "../hooks/useAppointments";

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdated: () => void;
  isAdmin: boolean;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  onClose,
  onUpdated,
  isAdmin,
}) => {
  const [reason, setReason] = useState(appointment.reason);
  const [date, setDate] = useState(
    new Date(appointment.date).toISOString().split("T")[0]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAppointment(appointment.id, { reason, date });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error actualizando cita:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isAdmin ? "Editar Cita" : "Solicitar Cambio"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
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
              className={`px-4 py-2 rounded ${
                isAdmin ? "bg-blue-600" : "bg-yellow-500"
              } text-white`}
            >
              {isAdmin ? "Actualizar" : "Solicitar Cambio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
