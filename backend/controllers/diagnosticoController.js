const pool = require('../config/db');
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

console.log("🔥 CONTROLADOR DIAGNOSTICO CARGADO");

// ===============================
// 🔥 CREAR DIAGNÓSTICO
// ===============================
exports.crearDiagnostico = async (req, res) => {
  try {

    const {
      paciente_id,
      resultado,
      probabilidad,
      tiene_fibroma,
      tipo_fibroma,
      recomendacion,
      imagen
    } = req.body;

    if (!paciente_id || probabilidad === undefined || tiene_fibroma === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const result = await pool.query(
      `INSERT INTO diagnosticos
      (paciente_id, resultado, probabilidad, tiene_fibroma, tipo_fibroma, recomendacion, imagen)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        paciente_id,
        resultado || null,
        probabilidad,
        tiene_fibroma,
        tipo_fibroma || null,
        recomendacion || null,
        imagen || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  let probabilidad = 0;
let resultado = "Sin datos";

if (imagen) {
  try {

    const imgPath = path.join(__dirname, "../uploads", imagen);

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imgPath));

    const response = await axios.post(
      "http://localhost:5000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    probabilidad = response.data.probabilidad;
    resultado = response.data.resultado;

    console.log("🤖 IA RESPONSE:", response.data);

  } catch (err) {
    console.log("⚠️ Error IA:", err.message);
  }
}
};

// ===============================
// 📋 LISTAR DIAGNÓSTICOS
// ===============================
exports.obtenerDiagnosticos = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        d.*,
        p.nombre AS paciente,
        p.genero,
        p.edad,
        u.nombre AS doctor,
        h.nombre AS hospital
      FROM diagnosticos d
      JOIN pacientes p ON p.id = d.paciente_id
      LEFT JOIN users u ON u.id = p.doctor_id
      LEFT JOIN hospitales h ON h.id = u.hospital_id
      ORDER BY d.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📄 PDF INDIVIDUAL FINAL PRO
// ===============================
exports.exportarPDF = async (req, res) => {

  try {

    const id = req.params.id;

    const result = await pool.query(`
      SELECT 
        d.*,
        p.nombre,
        p.edad,
        p.genero,
        u.nombre AS doctor,
        h.nombre AS hospital
      FROM diagnosticos d
      JOIN pacientes p ON p.id = d.paciente_id
      LEFT JOIN users u ON u.id = p.doctor_id
      LEFT JOIN hospitales h ON h.id = u.hospital_id
      WHERE d.id = $1
    `, [id]);

    const d = result.rows[0];
    if (!d) return res.status(404).json({ error: "No encontrado" });

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=diagnostico.pdf");

    // =========================
    // 🖼️ FONDO SUAVE (SIN TAPAR TEXTO)
    // =========================
  const fondo = path.join(__dirname, "../assets/logos/fondo.png");

if (fs.existsSync(fondo)) {
  doc.image(fondo, 0, 0, { width: 612, height: 792 });

  // 🔥 capa blanca translúcida simulada
  doc.save();
  doc.rect(0, 0, 612, 792)
     .fillOpacity(0.92)
     .fill("#ffffff");
  doc.restore();
}

    // =========================
    // 🏥 LOGO
    // =========================
    let logo = "Logo_Mayo.png";
    const h = (d.hospital || "").toLowerCase();

    if (h.includes("cayetano")) logo = "Logo_Cayetano.png";
    else if (h.includes("loayza")) logo = "Logo_Loayza.png";

    const logoPath = path.join(__dirname, "../assets/logos", logo);

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 55 });
    }

    // =========================
    // 🏷️ TITULO
    // =========================
    doc.fillColor("#0d47a1")
       .fontSize(22)
       .text("HEALTHNET", 110, 35);

    doc.fontSize(10)
       .fillColor("#555")
       .text("Reporte Clínico de Diagnóstico Médico IA", 110);

    doc.moveDown(2);

    // =========================
    // 👤 CARD PACIENTE (NO SUPERPONE)
    // =========================
    const startY = 120;

    doc.roundedRect(40, startY, 520, 85, 10)
       .fillAndStroke("#f4f7fb", "#d0d7e2");

    doc.fillColor("#000").fontSize(11);

    doc.text(`Paciente: ${d.nombre}`, 50, startY + 10);
    doc.text(`Edad: ${d.edad}`, 50, startY + 30);
    doc.text(`Género: ${d.genero}`, 250, startY + 30);
    doc.text(`Doctor: ${d.doctor || "N/A"}`, 50, startY + 50);
    doc.text(`Hospital: ${d.hospital || "N/A"}`, 250, startY + 50);

    // =========================
    // 🧠 RESULTADO
    // =========================
    doc.moveDown(6);

    const prob = d.probabilidad;

    let color = "#4caf50";
    if (prob > 0.6) color = "#e53935";
    else if (prob > 0.3) color = "#fb8c00";

    doc.fillColor("#0d47a1")
       .fontSize(14)
       .text("RESULTADO IA");

    doc.fillColor("#000")
       .fontSize(11)
       .text(`Resultado: ${d.resultado}`)
       .text(`Probabilidad: ${(prob * 100).toFixed(1)}%`);

    // BARRA
    doc.moveDown();

    doc.rect(50, doc.y, 300, 12).stroke();
    doc.rect(50, doc.y, 300 * prob, 12).fill(color);

    doc.moveDown(2);

    // =========================
    // 📋 RECOMENDACIÓN
    // =========================
    doc.fillColor("#0d47a1")
       .fontSize(13)
       .text("RECOMENDACIÓN MÉDICA");

    doc.fillColor("#000")
       .fontSize(11)
       .text(d.recomendacion || "Sin recomendación");

    // =========================
    // 🖼️ IMAGEN RM
    // =========================
    if (d.imagen) {

      const imgPath = path.join(__dirname, "../uploads", d.imagen);

      if (fs.existsSync(imgPath)) {
        doc.addPage();

        doc.fillColor("#0d47a1")
           .fontSize(14)
           .text("Imagen Médica");

        doc.image(imgPath, {
          fit: [450, 350],
          align: "center"
        });
      }
    }

    // =========================
    // ✍️ FIRMA
    // =========================
    doc.moveDown(4);

    doc.text("________________________");
    doc.text(`Dr. ${d.doctor || "No asignado"}`);
    doc.text("Firma Médica");

    doc.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📊 PDF GENERAL LIMPIO (UNA HOJA REAL)
// ===============================
exports.exportarPDFGeneral = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        d.id,
        d.resultado,
        d.probabilidad,
        p.nombre AS paciente,
        p.genero,
        u.nombre AS doctor,
        h.nombre AS hospital
      FROM diagnosticos d
      JOIN pacientes p ON p.id = d.paciente_id
      LEFT JOIN users u ON u.id = p.doctor_id
      LEFT JOIN hospitales h ON h.id = u.hospital_id
      ORDER BY d.id DESC
    `);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=historial.pdf");

    // HEADER
    doc.rect(0, 0, 612, 80).fill("#1f3b57");

    doc.fillColor("white")
       .fontSize(18)
       .text("HEALTHNET - HISTORIAL CLÍNICO", 40, 30);

    doc.moveDown(3);

    result.rows.forEach(d => {

      doc.roundedRect(40, doc.y, 520, 60, 8)
         .fillAndStroke("#f4f7fb", "#d0d7e2");

      doc.fillColor("#000").fontSize(10);

      doc.text(`Paciente: ${d.paciente}`, 50, doc.y - 50);
      doc.text(`Doctor: ${d.doctor || "N/A"}`);
      doc.text(`Hospital: ${d.hospital || "N/A"}`);
      doc.text(`Resultado: ${d.resultado}`);
      doc.text(`Probabilidad: ${(d.probabilidad * 100).toFixed(1)}%`);

      doc.moveDown(3);

    });

    doc.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};