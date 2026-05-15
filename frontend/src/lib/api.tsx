const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const access = localStorage.getItem("access");

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(options.headers || {}),
  };

  // Only set JSON header if NOT sending FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 🚨 Auto-logout ONLY for protected endpoints
  if (res.status === 401 && endpoint !== "/login/") {
    localStorage.clear();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.error || "Request failed");
  }

  return res.json();
}
