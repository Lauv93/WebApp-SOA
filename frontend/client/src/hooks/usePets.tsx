import { useEffect, useState } from "react";
import { getMyPets, deletePet } from "../api/pets";

export interface Pet {
  id: number;
  name: string;
  type: string;
  age: number;
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);

  async function loadPets() {
    try {
      const list = await getMyPets();
      setPets(list);
    } catch (err) {
      console.error("Error cargando mascotas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePet(id);
      await loadPets();
    } catch (err) {
      console.error("Error eliminando mascota:", err);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  return {
    pets,
    loading,
    showCreate,
    setShowCreate,
    editPet,
    setEditPet,
    loadPets,
    handleDelete,
  };
}
