require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// =========================
// APP INIT
// =========================
const app = express();

// =========================
// MIDDLEWARES GLOBALES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// SERVIR FRONTEND
// =========================
app.use(express.static(path.join(__dirname, "../frontend")));

// =========================
// DEBUG
// =========================
console.log("🔥 HEALTHNET BACKEND INICIADO");
console.log("PORT:", process.env.PORT || 3000);
console.log("JWT CONFIGURADO:", !!process.env.JWT_SECRET);

// =========================
// RUTA BASE
// =========================
app.get("/", (req, res) => {
  res.send("🚀 HealthNet API funcionando correctamente");
});

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const diagnosticoRoutes = require("./routes/diagnosticoRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // 🔥 AQUÍ

// =========================
// API PREFIX
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/diagnosticos", diagnosticoRoutes);
app.use("/api/hospitales", hospitalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes); // 🔥 AQUÍ

// =========================
// MIDDLEWARE JWT PRUEBA
// =========================
const authMiddleware = require("./middleware/authMiddleware");

app.get("/privado", authMiddleware, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user
  });
});

// =========================
// MANEJO GLOBAL DE ERRORES
// =========================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({
    message: "Error interno del servidor"
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});