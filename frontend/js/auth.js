async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // 🔐 VALIDACIÓN CRÍTICA
    if (!data.ok || !data.data || !data.data.usuario) {
      alert("Error en login");
      console.error("Respuesta inválida:", data);
      return;
    }

    console.log("RESPUESTA BACKEND:", data);

    // 💾 guardar sesión
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("usuario", JSON.stringify(data.data.usuario));

    const rol = data.data.usuario.rol;

    // 🔁 redirección por rol
    if (rol === "admin") {
      window.location.href = "/html/dashboard.html";
      return;
    }

    if (rol === "doctor") {
      window.location.href = "/html/dashboard.html";
      return;
    }

    if (rol === "especialista") {
      window.location.href = "/html/diagnostico.html";
      return;
    }

    // fallback
    window.location.href = "/html/index.html";

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    alert("No se pudo conectar con el servidor");
  }
}