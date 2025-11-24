import React, { useState } from "react";
import { updatePet } from "../api/pets";

interface Props {
  pet: any;
  onClose: () => void;
  onUpdated: () => void;
}

const EditPetModal: React.FC<Props> = ({ pet, onClose, onUpdated }) => {
  const [name, setName] = useState(pet.name);
  const [type, setSpecies] = useState(pet.type);
  const [age, setAge] = useState(pet.age);

  const handleUpdate = async () => {
    await updatePet(pet.id, { name, type, age });
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Editar Mascota</h2>

        <input
          className="w-full border p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          value={type}
          onChange={(e) => setSpecies(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleUpdate}
        >
          Guardar
        </button>

        <button
          className="w-full mt-2 bg-gray-300 p-2 rounded"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditPetModal;
