const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, role(["admin"]), userController.getUsers);
router.post("/", auth, role(["admin"]), userController.createUser);
router.put("/:id", auth, role(["admin"]), userController.updateUser);
router.delete("/:id", auth, role(["admin"]), userController.deleteUser);
router.put("/reset-password/:id", auth, role(["admin"]), userController.resetPassword);

module.exports = router;