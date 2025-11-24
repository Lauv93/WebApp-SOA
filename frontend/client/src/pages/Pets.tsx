import React from "react";
import { usePets } from "../hooks/usePets";
import PetCard from "../components/PetCard";
import CreatePetModal from "../components/CreatePetModal";
import EditPetModal from "../components/EditPetModal";

const Pets: React.FC = () => {
  const {
    pets,
    loading,
    showCreate,
    setShowCreate,
    editPet,
    setEditPet,
    handleDelete,
    loadPets,
  } = usePets();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Mascotas</h1>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCreate(true)}
      >
        + Agregar Mascota
      </button>
      {loading ? (
        <p className="text-gray-600">Cargando mascotas...</p>
      ) : pets.length === 0 ? (
        <p className="text-gray-600">No tienes mascotas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={() => setEditPet(pet)}
              onDelete={() => handleDelete(pet.id)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePetModal
          onClose={() => setShowCreate(false)}
          onCreated={loadPets}
        />
      )}

      {editPet && (
        <EditPetModal
          pet={editPet}
          onClose={() => setEditPet(null)}
          onUpdated={loadPets}
        />
      )}
    </div>
  );
};

export default Pets;
