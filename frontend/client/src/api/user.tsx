import api from "./api";

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}