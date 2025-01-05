const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTP } = require("../services/otpService");
const bcrypt = require("bcryptjs");
const { use } = require("../app");

// send otp
const sentOtp = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // get otp and expiresAt
    const { otp, expiresAt } = generateOTP();

    // save this otp and expiresAt in user document
    user.otp = { code: otp, expiresAt };
    await user.save();

    // send this otp to user phone number
    await sendOTP(phone, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // cleare otp after successful verification
    user.isActive = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isActive: false,
    });

    // send otp via twilio
    // const { otp, expiresAt } = generateOTP();
    // newUser.otp = { code: otp, expiresAt };
    await newUser.save();

    // send otp to user phone
    // await sendOTP(phone, otp);

    // Respond with success
    res.status(201).json({
      message: "User registered successfully. OTP sent to your phone number.",
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const login = async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email && !phone) {
    return res
      .status(400)
      .json({ message: "Please provide either email or phone" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please provide your password" });
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if OTP is verified
    // if (user.otp && user.otp.code) {
    //   return res.status(400).json({
    //     message: "OTP verification is required before login",
    //   });
    // }

    // Create and sign JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );

    // Respond with JWT token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const forgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if otp and new password are not provided then, send otp to user phone
    // if (!otp && !newPassword) {
    //   const { otp, expiresAt } = generateOTP();
    //   user.otp = { code: otp, expiresAt };
    //   await user.save();
    //   await sendOTP(phone, otp);
    //   return res.status(200).json({ message: "OTP sent successfully" });
    // }

    // verify otp
    // if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
    //   return res.status(401).json({ message: "Invalid or expired OTP" });
    // }

    // update password
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.otp = undefined;
      await user.save();

      return res.status(200).json({
        message: "Password updated successfully. You can now log in.",
      });
    }

    res.status(400).json({ message: "Please provide the required fields." });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { sentOtp, verifyOtp, register, login, forgotPassword };
