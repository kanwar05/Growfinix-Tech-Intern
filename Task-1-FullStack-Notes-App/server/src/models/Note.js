const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? tags
              .map((tag) => String(tag).trim().toLowerCase())
              .filter(Boolean)
          : [],
    },
    category: {
      type: String,
      trim: true,
      default: "general",
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

noteSchema.index({ title: "text", content: "text", tags: "text", category: "text" });

module.exports = mongoose.model("Note", noteSchema);