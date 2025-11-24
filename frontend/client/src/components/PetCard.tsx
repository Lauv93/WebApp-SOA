import React from "react";

interface PetCardProps {
  pet: any;
  onEdit: () => void;
  onDelete: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow p-4 rounded flex flex-col gap-2">
      <h2 className="text-xl font-bold">{pet.name}</h2>
      <p className="text-gray-600">Edad: {pet.age}</p>
      <p className="text-gray-600">Especie: {pet.type}</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default PetCard;
