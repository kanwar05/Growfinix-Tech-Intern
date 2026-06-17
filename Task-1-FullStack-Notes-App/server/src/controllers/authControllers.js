const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { setAuthCookie, clearAuthCookie } = require("../utils/authCookie");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
  };
};

const sendToken = (res, user, statusCode = 200) => {
  setAuthCookie(res, user._id);
  res.status(statusCode).json({
    success: true,
    user: sanitizeUser(user),
  });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    sendToken(res, user, 201);
  } catch (error) {
    next(error);
  }
};

exports.signup = exports.register;

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendToken(res, user);
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: sanitizeUser(req.user) });
};
