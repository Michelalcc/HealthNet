let historialGlobal = [];

// ==========================
// 📥 CARGAR DATOS
// ==========================
async function cargarHistorial() {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/diagnosticos", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    historialGlobal = await res.json();

    console.log("📊 DATOS:", historialGlobal);

    renderHistorial(historialGlobal);

  } catch (err) {
    console.error("Error cargando historial:", err);
  }
}

// ==========================
// 🎨 RENDER
// ==========================
function renderHistorial(data) {

  const cont = document.getElementById("listaHistorial");

  if (!cont) return;

  if (data.length === 0) {
    cont.innerHTML = "<p>No hay resultados</p>";
    return;
  }

  cont.innerHTML = data.map(d => {

    let clase = "verde";

    if (d.probabilidad > 0.6) clase = "rojo";
    else if (d.probabilidad > 0.3) clase = "amarillo";

    return `
      <div class="historial-card">

        <b>${d.paciente || "Sin nombre"}</b><br>

        Género: ${d.genero || "N/A"}<br>
        Doctor: ${d.doctor || "N/A"}<br>
        Hospital: ${d.hospital || "N/A"}<br>

        <br>

        Resultado: ${d.resultado || "N/A"}<br>

        <span class="badge ${clase}">
          ${(d.probabilidad * 100).toFixed(1)}%
        </span>

        <br><br>
        ${d.recomendacion || ""}

        <br><br>

        <!-- 📄 BOTÓN PDF INDIVIDUAL -->
        <button onclick="descargarPDF(${d.id})">
          📄 Descargar PDF
        </button>

      </div>
    `;

  }).join("");
}

// ==========================
// 🔍 FILTROS
// ==========================
function aplicarFiltros() {

  const nombre = (document.getElementById("fNombre").value || "").toLowerCase();
  const genero = document.getElementById("fGenero").value;
  const hospital = (document.getElementById("fHospital").value || "").toLowerCase();
  const doctor = (document.getElementById("fDoctor").value || "").toLowerCase();
  const orden = document.getElementById("orden").value;

  let filtrados = historialGlobal.filter(d => {

    const nombreOK = (d.paciente || "").toLowerCase().includes(nombre);
    const generoOK = !genero || d.genero === genero;
    const hospitalOK = (d.hospital || "").toLowerCase().includes(hospital);
    const doctorOK = (d.doctor || "").toLowerCase().includes(doctor);

    return nombreOK && generoOK && hospitalOK && doctorOK;

  });

  // 🧠 ORDENAMIENTO
  if (orden === "reciente") filtrados.sort((a, b) => b.id - a.id);
  if (orden === "antiguo") filtrados.sort((a, b) => a.id - b.id);
  if (orden === "prob") filtrados.sort((a, b) => b.probabilidad - a.probabilidad);

  renderHistorial(filtrados);
}

// ==========================
// 📄 PDF INDIVIDUAL
// ==========================
function descargarPDF(id) {

  const token = localStorage.getItem("token");

  window.open(
    `http://localhost:3000/api/diagnosticos/pdf/${id}?token=${token}`,
    "_blank"
  );
}

// ==========================
// 📊 PDF GENERAL
// ==========================
function descargarPDFGeneral() {

  const token = localStorage.getItem("token");

  window.open(
    `http://localhost:3000/api/diagnosticos/pdf-general?token=${token}`,
    "_blank"
  );
}

// ==========================
// 🌐 GLOBAL
// ==========================
window.cargarHistorial = cargarHistorial;
window.aplicarFiltros = aplicarFiltros;
window.descargarPDF = descargarPDF;
window.descargarPDFGeneral = descargarPDFGeneral;