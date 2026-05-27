function initPagina(pagina) {

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  if (!usuario || !token) {
    window.location.href = "/html/index.html";
    return;
  }

  const permisos = {
    admin: ["dashboard", "diagnostico", "pacientes", "historial", "users", "hospitales", "reportes"],
    doctor: ["dashboard", "diagnostico", "pacientes", "historial"],
    especialista: ["dashboard", "diagnostico"]
  };

  const accesos = permisos[usuario.rol];

  if (!accesos || !accesos.includes(pagina)) {
    window.location.href = "/html/dashboard.html";
    return;
  }

  cargarUsuario();
}