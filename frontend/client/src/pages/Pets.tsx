import React from 'react'

const Pets: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Mascotas</h1>
      <p className="mb-6 text-gray-600">Gestiona el perfil de tus mascotas</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">No hay mascotas aún.</div>
      </div>
    </div>
  )
}

export default Pets
