export interface Pet {
  id: number;
  name: string;
  type: string;
  age: number;
  user_id: number;
}

import api from "./api";

export async function getMyPets() {
  const token = localStorage.getItem("token");

  const res = await api.get("/pets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data as Pet[];
}

export const getPetById = async (id: number) => {
  return api.get(`/pets/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const createPet = async (data: any) => {
  return api.post("/pets", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updatePet = async (id: number, data: any) => {
  return api.patch(`/pets/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export async function deletePet(id: number) {
  const token = localStorage.getItem("token");

  await api.delete(`/pets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
