import { useState, useEffect } from "react";
import {
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByPet,
} from "../api/medicalRecord";
import { getMyPets, Pet } from "../api/pets";

export interface MedicalRecord {
  id: number;
  pet_id: number;
  description?: string;
  treatment: string;
  date: string;
  weight?: string;
  diagnosis?: string;
  pet_name?: string;
}

export function useMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<MedicalRecord | null>(null);

  // Cargar todas las mascotas del usuario (o admin)
  async function loadPets() {
    try {
      const data = await getMyPets(); // tu endpoint ya devuelve según rol
      setPets(data);
    } catch (err) {
      console.error("Error cargando mascotas:", err);
    }
  }

  // Cargar todos los registros médicos según rol y mascotas
  async function loadRecords() {
    try {
      setLoading(true);

      // Si el usuario tiene mascotas, cargamos los registros de cada una
      const recordsPromises = pets.map((pet) => getMedicalRecordsByPet(pet.id));
      const recordsArrays = await Promise.all(recordsPromises);
      // Aplanar los arrays y opcionalmente agregar nombre de la mascota
      const allRecords = recordsArrays.flat().map((r, i) => ({
        ...r,
        pet_name: pets.find((p) => p.id === r.pet_id)?.name,
      }));

      setRecords(allRecords);
    } catch (err) {
      console.error("Error cargando registros médicos:", err);
    } finally {
      setLoading(false);
    }
  }

  // Borrar un registro
  async function handleDelete(id: number) {
    try {
      await deleteMedicalRecord(id);
      await loadRecords();
    } catch (err) {
      console.error("Error eliminando registro médico:", err);
    }
  }

  // Ejecutar al montar
  useEffect(() => {
    const init = async () => {
      await loadPets();
    };
    init();
  }, []);

  // Cargar registros cuando las mascotas estén cargadas
  useEffect(() => {
    if (pets.length > 0) {
      loadRecords();
    }
  }, [pets]);

  return {
    records,
    pets,
    loading,
    showCreate,
    setShowCreate,
    editRecord,
    setEditRecord,
    loadRecords,
    loadPets,
    handleDelete,
  };
}
