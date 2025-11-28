const express = require("express");
const router = express.Router();
const authMiddleware = require("../midleware/auth");
const authController = require("../controller/authController"); 

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
