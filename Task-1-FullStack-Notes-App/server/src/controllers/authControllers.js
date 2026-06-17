const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { setAuthCookie, clearAuthCookie } = require("../utils/authCookie");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    themePreference: user.themePreference,
    createdAt: user.createdAt,
  };
};

const isValidThemePreference = (themePreference) =>
  ["system", "light", "dark"].includes(themePreference);

const isValidAvatar = (avatar) => {
  if (avatar === "") return true;

  return (
    typeof avatar === "string" &&
    avatar.length <= 1_500_000 &&
    /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar)
  );
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

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, themePreference } = req.body;
    const user = req.user;

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter a valid email" });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ success: false, message: "Email is already in use" });
      }

      user.email = normalizedEmail;
    }

    if (avatar !== undefined) {
      if (!isValidAvatar(avatar)) {
        return res.status(400).json({
          success: false,
          message: "Avatar must be a PNG, JPG, or WebP image under 1.5MB",
        });
      }

      user.avatar = avatar;
    }

    if (themePreference !== undefined) {
      if (!isValidThemePreference(themePreference)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid theme preference" });
      }

      user.themePreference = themePreference;
    }

    await user.save();

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
};
