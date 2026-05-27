// =========================
// 🔐 RUTAS Y PERMISOS
// =========================
const PERMISSIONS = {
  admin: ["dashboard", "diagnostico", "pacientes", "historial", "users", "hospitales", "reportes"],
  doctor: ["dashboard", "diagnostico", "pacientes", "historial"],
  especialista: ["dashboard", "diagnostico"]
};

// =========================
// TOGGLE MENU
// =========================
function toggleMenu() {
  document.getElementById("sidebar")?.classList.toggle("hidden");
}

// =========================
// 🔐 VERIFICAR SESIÓN
// =========================
function verificarSesion() {
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!user || !user.rol) {
    window.location.href = "/html/index.html";
    return null;
  }

  return user;
}

// =========================
// 👤 USUARIO PRINCIPAL
// =========================
function cargarUsuario() {

  const user = verificarSesion();
  if (!user) return;

  const nombre = document.getElementById("nombreUser");
  const rol = document.getElementById("rolUser");
  const imgUser = document.getElementById("imgUser");

  if (nombre) nombre.innerText = user.email || "";
  if (rol) rol.innerText = user.rol || "";

  const images = {
    admin: "admin.png",
    doctor: "doctor2.png",
    especialista: "doc_esp.png"
  };

  if (imgUser) {
    imgUser.src = `../assets/imagenes/users/${images[user.rol] || "doctor1.png"}`;
  }

  aplicarTemaHospital(user);
  cargarInfoHospital(user);
  renderMenuByRole(user);
}

// =========================
// 🧭 MENÚ DINÁMICO
// =========================
function renderMenuByRole(user) {

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const menuItems = {
    dashboard: "🏠 Inicio",
    diagnostico: "🧠 Diagnóstico IA",
    pacientes: "👥 Pacientes",
    historial: "📋 Historial",
    users: "👤 Usuarios",
    hospitales: "🏥 Hospitales",
    reportes: "📊 Reportes"
  };

  const permisos = PERMISSIONS[user.rol] || [];

  let menuHTML = `
    <div class="logo">🏥 HealthNet</div>
  `;

  permisos.forEach(p => {
    menuHTML += `
      <div onclick="location.href='${p}.html'">
        ${menuItems[p]}
      </div>
    `;
  });

  menuHTML += `
    <hr>
    <div onclick="logout()">🚪 Cerrar sesión</div>
  `;

  sidebar.innerHTML = menuHTML;
}

// =========================
// 🎨 TEMA HOSPITAL
// =========================
function aplicarTemaHospital(user) {

  const root = document.documentElement;

  const colores = {
    1: "#c9a227",
    2: "#1565c0",
    3: "#2e7d32"
  };

  root.style.setProperty("--primary", colores[user.hospital_id] || "#1565c0");
}

// =========================
// 🏥 INFO HOSPITAL
// =========================
function cargarInfoHospital(user) {

  const hospitales = {
    1: "Hospital Cayetano Heredia",
    2: "Hospital Loayza",
    3: "Hospital Dos de Mayo"
  };

  const nombre = hospitales[user.hospital_id] || "Hospital";

  const hospitalNombre = document.getElementById("nombreHospital");
  const subtitulo = document.getElementById("subtituloHospital");
  const logoHospital = document.getElementById("logoHospital");

  if (hospitalNombre) hospitalNombre.innerText = nombre;
  if (subtitulo) subtitulo.innerText = "Sistema clínico - " + nombre;

  if (logoHospital) {
    logoHospital.innerHTML = `
      <img src="../assets/imagenes/logos/logo.png"
        style="width:42px;height:42px;border-radius:50%;object-fit:cover;margin-right:10px;">
      ${nombre}
    `;
  }
}

// =========================
// 🚪 LOGOUT
// =========================
function logout() {
  localStorage.clear();
  window.location.href = "/html/index.html";
}

// =========================
// 🔐 PROTEGER RUTA
// =========================
function protegerRuta(pagina) {

  const user = verificarSesion();
  if (!user) return;

  const permisos = PERMISSIONS[user.rol] || [];

  if (!permisos.includes(pagina)) {
    window.location.href = "/html/dashboard.html";
  }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
});