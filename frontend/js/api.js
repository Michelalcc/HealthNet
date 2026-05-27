const API_URL = "http://localhost:3000/api";

// =========================
// FETCH GLOBAL SEGURA
// =========================
async function apiFetch(endpoint, options = {}) {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    // 🔥 si token expiró
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/html/index.html";
      return;
    }

    return res;

  } catch (error) {
    console.error("API ERROR:", error);
    alert("Error de conexión con el servidor");
  }
}