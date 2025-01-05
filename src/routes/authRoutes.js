const express = require("express");
const {
  register,
  login,
  verifyOtp,
  forgotPassword,
  sentOtp,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/send-otp", sentOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
