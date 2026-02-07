const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const access = localStorage.getItem("access");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 🚨 Auto-logout ONLY for protected endpoints
  if (res.status === 401 && endpoint !== "/api/login/") {
    localStorage.clear();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error("Unauthorized");
  }

  // Normal error handling (including login failures)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Invalid credentials");
  }

  return res.json();
}
