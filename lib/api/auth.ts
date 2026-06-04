import { apiRequest } from "../apiClient";

// LOGIN
export function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest("/auth/login", "POST", data);
}

// REGISTER
export function registerUser(data: {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}) {
  return apiRequest("/auth/register", "POST", data);
}