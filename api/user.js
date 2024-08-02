
import api from "./callAPI";
import { jwtDecode } from "jwt-decode";

export const callApiCreateAccount = async (userData) => {
  const { data } = await api.post("/api/v1/auth/register", userData);
  return data;
};