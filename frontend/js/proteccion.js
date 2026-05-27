function proteger(paginaActual) {

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  // 🔐 validación de sesión completa
  if (!usuario || !token || !usuario.rol) {
    window.location.href = "/html/index.html";
    return;
  }

  // 🔐 permisos centralizados
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

  const accesos = PERMISOS[usuario.rol];

  // 🔐 rol no reconocido
  if (!accesos) {
    console.warn("Rol no válido:", usuario.rol);
    window.location.href = "/html/index.html";
    return;
  }

  // 🔐 acceso denegado
  if (!accesos.includes(paginaActual)) {
    window.location.href = "/html/dashboard.html";
    return;
  }
}