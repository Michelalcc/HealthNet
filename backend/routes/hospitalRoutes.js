const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// 🔐 SOLO ADMIN
router.get("/", auth, role(["admin"]), (req, res) => {
  res.json({
    message: "Lista de hospitales",
    data: []
  });
});

module.exports = router;