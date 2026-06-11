import api from "../api/api";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("imagen", file);

  const response = await api.post("/uploads/upload", formData);

  return response.data;
};