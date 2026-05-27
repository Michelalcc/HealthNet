exports.exportarPDFGeneral = async (req, res) => {

  const result = await pool.query(`
    SELECT d.*, p.nombre
    FROM diagnosticos d
    JOIN pacientes p ON p.id = d.paciente_id
    ORDER BY d.id DESC
  `);

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=historial.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("HISTORIAL CLÍNICO HEALTHNET");
  doc.moveDown();

  result.rows.forEach(d => {
    doc.fontSize(12).text(
      `${d.nombre} | ${d.resultado} | ${d.probabilidad}`
    );
    doc.moveDown(0.5);
  });

  doc.end();
};