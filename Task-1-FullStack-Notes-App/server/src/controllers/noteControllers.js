const mongoose = require("mongoose");
const Note = require("../models/Note");

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
};

const buildFilters = (req) => {
  const { search, tag, category, archived } = req.query;
  const filters = {
    owner: req.user._id,
    isArchived: archived === "true",
    isTrashed: false,
  };

  if (tag) {
    filters.tags = String(tag).trim().toLowerCase();
  }

  if (category) {
    filters.category = String(category).trim().toLowerCase();
  }

  if (search) {
    const searchRegex = new RegExp(String(search).trim(), "i");
    filters.$or = [
      { title: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
      { category: searchRegex },
    ];
  }

  return filters;
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find(buildFilters(req)).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrashNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      owner: req.user._id,
      isTrashed: true,
    }).sort({ trashedAt: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: false,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags: normalizeTags(req.body.tags),
      category: category?.trim().toLowerCase() || "general",
      owner: req.user._id,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: false,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const { title, content, category } = req.body;

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category.trim().toLowerCase();
    if (req.body.tags !== undefined) note.tags = normalizeTags(req.body.tags);

    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.togglePinNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: false,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: note.isPinned ? "Note pinned" : "Note unpinned",
      note,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleArchiveNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: false,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      message: note.isArchived ? "Note archived" : "Note unarchived",
      note,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: false,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isTrashed = true;
    note.trashedAt = new Date();
    note.isPinned = false;
    await note.save();

    res.status(200).json({ success: true, message: "Note moved to trash", note });
  } catch (error) {
    next(error);
  }
};

exports.restoreNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: true,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found in trash" });
    }

    note.isTrashed = false;
    note.trashedAt = null;
    await note.save();

    res.status(200).json({ success: true, message: "Note restored", note });
  } catch (error) {
    next(error);
  }
};

exports.permanentlyDeleteNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid note id" });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
      isTrashed: true,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found in trash" });
    }

    res.status(200).json({ success: true, message: "Note permanently deleted" });
  } catch (error) {
    next(error);
  }
};
