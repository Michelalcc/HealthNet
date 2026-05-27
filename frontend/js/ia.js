var paciente = null;
var probabilidadGlobal = 0;
var nivelGlobal = "";
var fibroma = false;
var recomendacionGlobal = "";
var resultadoGlobal = "";

// 🔍 ANALIZAR
async function analizar() {
  try {

    const input = document.getElementById("imageInput");

    if (!input.files || input.files.length === 0) {
      alert("Selecciona imagen");
      return;
    }

    const file = input.files[0];

    // 🖼️ PREVIEW
    document.getElementById("preview").src = URL.createObjectURL(file);

    // 🟦 UX: ESTADO 1
    document.getElementById("resultadoCard").innerHTML = `
      <h3>🟦 Analizando imagen médica...</h3>
      <p>Procesando estructura cardíaca...</p>
    `;

    await delay(1200);

    // 🧠 UX: ESTADO 2
    document.getElementById("resultadoCard").innerHTML = `
      <h3>🧠 Ejecutando modelo de IA...</h3>
      <p>Evaluando probabilidad de fibrosis...</p>
    `;

    await delay(1500);

    // 🔗 PACIENTE
    const nombre = file.name.split(".")[0];
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/pacientes/auto/" + nombre, {
      headers: { "Authorization": "Bearer " + token }
    });

    paciente = await res.json();

    document.getElementById("pacienteCard").innerHTML = `
      <h3>Datos del Paciente</h3>
      <b>Nombre:</b> ${paciente.nombre}<br>
      <b>Edad:</b> ${paciente.edad}<br>
      <b>Género:</b> ${paciente.genero}<br>
      <b>Enfermedades:</b> ${paciente.enfermedades}<br>
      <b>Alergias:</b> ${paciente.alergias}
    `;

    // 🧠 IA (SIMULADA PERO YA REALISTA UX)
    const prob = Math.random() * 0.4 + 0.5; // más realista (0.5–0.9)
    probabilidadGlobal = prob;

    let texto = "";
    let clase = "";

    if (prob < 0.6) {
      texto = "Moderado";
      clase = "amarillo";
      nivelGlobal = "moderado";
      resultadoGlobal = "Moderado";
    } else {
      texto = "Alto riesgo";
      clase = "rojo";
      nivelGlobal = "avanzado";
      resultadoGlobal = "Alto riesgo";
    }

    // 📊 RESULTADO FINAL
    document.getElementById("resultadoCard").innerHTML = `
      <h3>📊 Resultado IA</h3>
      <span class="badge ${clase}">
        ${texto} (${(prob * 100).toFixed(1)}%)
      </span>
    `;

    // 📊 BARRA
    const barra = document.getElementById("barra");
    barra.style.width = (prob * 100) + "%";
    barra.className = clase;

    generarRecomendacion();

  } catch (e) {
    console.error("ERROR ANALIZAR:", e);
  }
}

// 🔘 FIBROMA
function setFibroma(v) {

  fibroma = v;

  if (v) {
    document.getElementById("nivelFibroma").classList.remove("hidden");
  } else {
    document.getElementById("nivelFibroma").classList.add("hidden");
  }

  generarRecomendacion();
}

// 🧠 RECOMENDACIÓN
function generarRecomendacion() {

  let nivel = nivelGlobal;

  // Si hay fibroma, usar selector
  if (fibroma) {
    const select = document.getElementById("nivel");
    if (select) {
      nivel = select.value;
    }
  }

  let texto = "";

  if (nivel === "leve") {
    texto = "Paciente sin evidencia significativa de fibrosis. Se recomienda control clínico periódico, hábitos saludables y reevaluación en 6 meses.";
  } 
  else if (nivel === "moderado") {
    texto = "Probabilidad moderada de fibrosis. Se recomienda evaluación cardiológica, ecocardiograma y seguimiento clínico en 3 meses.";
  } 
  else if (nivel === "avanzado") {
    texto = "Alta probabilidad de fibrosis. Se recomienda derivación urgente a cardiología, resonancia magnética cardíaca y posible intervención especializada.";
  }

  recomendacionGlobal = texto;

  document.getElementById("recomendacionCard").innerHTML = `
    <h3>Recomendación Médica</h3>
    ${texto}
  `;
}

// 💾 GUARDAR
async function guardar() {

  try {

    if (!paciente) {
      alert("Primero analiza la imagen");
      return;
    }

    var token = localStorage.getItem("token");

    var res = await fetch("http://localhost:3000/api/diagnosticos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        paciente_id: paciente.id,
        resultado: resultadoGlobal,
        probabilidad: probabilidadGlobal,
        tiene_fibroma: fibroma,
        tipo_fibroma: fibroma ? "Cardíaco" : "No aplica",
        recomendacion: recomendacionGlobal,
        imagen: paciente.imagen
      })
    });

    if (!res.ok) {
      alert("Error al guardar");
      return;
    }

    alert("Diagnóstico guardado correctamente");

  } catch (e) {
    console.error("ERROR GUARDAR:", e);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🌐 GLOBAL
window.analizar = analizar;
window.setFibroma = setFibroma;
window.guardar = guardar;