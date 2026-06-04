const BASE_URL = "/api";

export async function apiRequest(
  endpoint: string,
  method: string = "POST",
  body?: any,
  requireAuth: boolean = false
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}