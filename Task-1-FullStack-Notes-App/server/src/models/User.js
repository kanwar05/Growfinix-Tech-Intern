const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    themePreference: {
      type: String,
      enum: ["system", "light", "dark"],
      default: "system",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
