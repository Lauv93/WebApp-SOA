import api from "./api";

export async function getMedicalRecordsByPet(petId: number) {
  const token = localStorage.getItem("token");

  const res = await api.get(`/medical-records/pet/${petId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

export const getMedicalRecordById = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await api.get(`/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const createMedicalRecord = async (data: any) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/medical-records", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateMedicalRecord = async (id: number, data: any) => {
  const token = localStorage.getItem("token");

  const res = await api.patch(`/medical-records/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export async function deleteMedicalRecord(id: number) {
  const token = localStorage.getItem("token");

  const res = await api.delete(`/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
