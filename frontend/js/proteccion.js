// =========================
// 🔐 SISTEMA ÚNICO DE PROTECCIÓN FRONTEND
// =========================

function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function getToken() {
  return localStorage.getItem("token");
}

// =========================
// 🔐 PROTEGER PÁGINA (FUNCIÓN OFICIAL)
// =========================
function proteger(pagina) {

  const usuario = getUsuario();
  const token = getToken();

  // 🚨 sin sesión
  if (!usuario || !token) {
    window.location.href = "/html/index.html";
    return false;
  }

  // 🚨 sin rol
  if (!usuario.rol) {
    window.location.href = "/html/index.html";
    return false;
  }

  // =========================
  // 👥 PERMISOS POR ROL
  // =========================
  const permisos = {
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

  const accesos = permisos[usuario.rol];

  // 🚨 rol inexistente
  if (!accesos) {
    window.location.href = "/html/index.html";
    return false;
  }

  // 🚨 sin permiso a la página
  if (!accesos.includes(pagina)) {
    window.location.href = "/html/dashboard.html";
    return false;
  }

  return true;
}

// =========================
// 🔐 VERIFICACIÓN RÁPIDA (OPCIONAL)
// =========================
function verificarSesion() {
  const usuario = getUsuario();
  const token = getToken();

  return !!(usuario && token);
}