import React, { useState, useEffect } from "react";
import { useAppointments } from "../hooks/useAppointments";
import AppointmentCard from "../components/AppointmentCard";
import CreateAppointmentModal from "../components/CreateAppointmentsModal";
import EditAppointmentModal from "../components/EditAppointmetModal";

// Función para extraer el rol del token JWT
function getRoleFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role;
  } catch (e) {
    console.error("Error decodificando token", e);
    return null;
  }
}

const Appointments: React.FC = () => {
  const {
    appointments,
    loading,
    showCreate,
    setShowCreate,
    editAppointment,
    setEditAppointment,
    handleDelete,
    loadAppointments,
  } = useAppointments();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = getRoleFromToken();
    setIsAdmin(role === "admin");
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCreate(true)}
      >
        + Agregar Cita
      </button>

      {loading ? (
        <p className="text-gray-600">Cargando citas...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">No hay citas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onEdit={() => setEditAppointment(appt)}
              onDelete={() => handleDelete(appt.id)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateAppointmentModal
          onClose={() => setShowCreate(false)}
          onCreated={loadAppointments}
          isAdmin={isAdmin}
        />
      )}

      {editAppointment && (
        <EditAppointmentModal
          appointment={editAppointment}
          onClose={() => setEditAppointment(null)}
          onUpdated={loadAppointments}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Appointments;
