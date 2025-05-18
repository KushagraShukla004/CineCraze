const express = require("express");
const { currentUser, login, register } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, currentUser);

module.exports = router;
