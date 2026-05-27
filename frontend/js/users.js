const API = "http://localhost:3000/api/users";

// LISTAR
async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  const container = document.getElementById("userList");

  container.innerHTML = users.map(u => `
    <div class="card">
      <b>${u.email}</b><br>
      Rol: ${u.rol} | Hospital: ${u.hospital_id}

      <button onclick="deleteUser(${u.id})">Eliminar</button>
    </div>
  `).join("");
}

// CREAR
async function createUser() {

  const data = {
    email: email.value,
    password: password.value,
    rol: rol.value,
    hospital_id: hospital.value
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  loadUsers();
}

// ELIMINAR
async function deleteUser(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadUsers();
}