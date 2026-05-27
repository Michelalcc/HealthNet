let pacientesGlobal = [];
let ordenActual = "az";

// 📥 CARGAR
async function cargarPacientes() {

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/pacientes", {
    headers: { "Authorization": "Bearer " + token }
  });

  pacientesGlobal = await res.json();

  renderPacientes(pacientesGlobal);
}

// 🎨 RENDER
function renderPacientes(data) {

  const cont = document.getElementById("listaPacientes");

  cont.innerHTML = data.map(p => `
    <div class="paciente-card">
      <b>${p.nombre}</b><br>
      Edad: ${p.edad} | ${p.genero}<br>
      Enfermedades: ${p.enfermedades || "Ninguna"}
    </div>
  `).join("");
}

// 🔍 FILTRO PROFESIONAL
function aplicarFiltros() {

  const texto = document.getElementById("buscarPaciente").value.toLowerCase();
  const genero = document.getElementById("filtroGenero").value;
  const orden = document.getElementById("ordenar").value;

  let data = [...pacientesGlobal];

  // 🔎 texto
  if (texto) {
    data = data.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  // 👤 género
  if (genero) {
    data = data.filter(p => p.genero === genero);
  }

  // 🔃 orden
  if (orden === "az") {
    data.sort((a,b) => a.nombre.localeCompare(b.nombre));
  }

  if (orden === "za") {
    data.sort((a,b) => b.nombre.localeCompare(a.nombre));
  }

  renderPacientes(data);
}

// 🔃 ORDENAMIENTO PROFESIONAL
function ordenarPacientes(tipo) {

  ordenActual = tipo;

  let ordenados = [...pacientesGlobal];

  if (tipo === "az") {
    ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (tipo === "za") {
    ordenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  if (tipo === "edad") {
    ordenados.sort((a, b) => b.edad - a.edad);
  }

  renderPacientes(ordenados);
}