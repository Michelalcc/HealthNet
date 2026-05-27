// =========================
// 🔐 PROTECCIÓN DE RUTAS FRONTEND
// =========================

const PERMISOS = {
  admin: [
    "dashboard",
    "diagnostico",
    "pacientes",
    "historial",
    "users",
    "hospitales",
    "reportes"
  ],
  doctor: [
    "dashboard",
    "diagnostico",
    "pacientes",
    "historial"
  ],
  especialista: [
    "dashboard",
    "diagnostico"
  ]
};

// =========================
// PROTEGER PÁGINA
// =========================
function proteger(paginaActual) {

  const user = JSON.parse(localStorage.getItem("usuario"));

  // 🔴 si no hay sesión
  if (!user || !user.rol) {
    window.location.href = "/html/index.html";
    return;
  }

  const permisosUsuario = PERMISOS[user.rol];

  // 🔴 si rol no existe en sistema
  if (!permisosUsuario) {
    console.warn("Rol desconocido:", user.rol);
    window.location.href = "/html/index.html";
    return;
  }

  // 🔴 si no tiene acceso a la página
  if (!permisosUsuario.includes(paginaActual)) {
    window.location.href = "/html/dashboard.html";
    return;
  }
}