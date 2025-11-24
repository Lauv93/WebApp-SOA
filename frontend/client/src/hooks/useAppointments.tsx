import { useEffect, useState } from "react";
import { deleteAppointment,getMyAppointmets } from "../api/appointments";

export interface Appointment {
  id: number;
  reason: string;
  date: Date;
  status: string;
  pet_name?: string;
  owner?: string;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  async function loadAppointments() {
    try {
      const list = await getMyAppointmets();
      setAppointments(list);
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAppointment(id);
      await loadAppointments();
    } catch (err) {
      console.error("Error eliminando citas:", err);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  return {
    appointments,
    loading,
    showCreate,
    setShowCreate,
    editAppointment,
    setEditAppointment,
    loadAppointments,
    handleDelete,
  };
}
