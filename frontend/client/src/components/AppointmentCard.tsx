import React from "react";
import { Appointment } from "../hooks/useAppointments";

interface AppointmentCardProps {
  appointment: Appointment & { pet_name?: string; owner?: string };
  onEdit: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold mb-2">{appointment.reason}</h2>
      <p className="text-gray-600 mb-1">Mascota: {appointment.pet_name}</p>
      {isAdmin && appointment.owner && (
        <p className="text-gray-600 mb-1">Dueño: {appointment.owner}</p>
      )}
      <p className="text-gray-600 mb-1">
        Fecha: {new Date(appointment.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">Estado: {appointment.status}</p>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={onEdit}
        >
          {isAdmin ? "Editar" : "Solicitar cambio"}
        </button>

        {isAdmin && onDelete && (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={onDelete}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
