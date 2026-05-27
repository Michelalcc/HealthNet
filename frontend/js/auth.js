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

    console.log("🔵 RESPUESTA BACKEND:", data);

    if (!res.ok) {
      alert(data.message || "Error de login");
      return;
    }

    if (!data.usuario) {
      alert("Backend no devolvió usuario");
      return;
    }

    // 💾 guardar sesión
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    const rol = data.usuario.rol;

    // 🔁 redirección correcta según tu estructura real
    if (rol === "admin") {
      window.location.href = "/html/dashboard.html";
    }

    if (rol === "doctor") {
      window.location.href = "/html/dashboard.html";
    }

    if (rol === "especialista") {
      window.location.href = "/html/diagnostico.html";
    }

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
}