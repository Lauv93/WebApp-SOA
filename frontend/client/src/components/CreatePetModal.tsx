import React, { useState } from "react";
import { createPet } from "../api/pets";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreatePetModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");

  const handleCreate = async () => {
    if (!name || !type || !age) {
      alert("Todos los campos son obligatorios");
      return;
    }

    await createPet({ name, type, age });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Agregar Mascota</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Especie"
          value={type} onChange={(e) => setType(e.target.value)} 
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white p-2 rounded"
          onClick={handleCreate}
        >
          Crear
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

export default CreatePetModal;
