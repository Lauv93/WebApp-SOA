import api from "./api";

export async function getMyAppointmets() {
  const token = localStorage.getItem("token");

  const res = await api.get("/appointments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export const getAppointmentById = async (id: number) => {
  return api.get(`/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const createAppointment = async (data: any) => {
  return api.post("/appointments", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateAppointment = async (id: number, data: any) => {
  return api.patch(`/appointments/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export async function deleteAppointment(id: number) {
  const token = localStorage.getItem("token");

  await api.delete(`/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
