async function cargarDashboard() {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("DASHBOARD DATA:", data);

    document.querySelector("p:nth-child(1)").innerText =
      "Total pacientes: " + data.totalPacientes;

    document.querySelector("p:nth-child(2)").innerText =
      "Diagnósticos hoy: " + data.diagnosticosHoy;

  } catch (error) {
    console.error("ERROR DASHBOARD:", error);
  }
}