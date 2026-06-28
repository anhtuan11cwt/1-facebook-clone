import api from "./urlService";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const checkUserAuth = async () => {
  const response = await api.get("/users/check-auth");
  return response.data;
};
