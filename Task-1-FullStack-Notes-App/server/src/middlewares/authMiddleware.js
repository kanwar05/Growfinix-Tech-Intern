const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { cookieName } = require("../utils/authCookie");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies[cookieName];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};
