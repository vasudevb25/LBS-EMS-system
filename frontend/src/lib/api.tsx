const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include", // 🔐 session cookie always sent
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // 🔥 Handle expired session globally
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  // Handle non-JSON responses
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.error || "API Error");
  }

  return data;
}
