const express = require("express");
const {
  getNotes,
  getTrashNotes,
  getNote,
  createNote,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
  restoreNote,
  permanentlyDeleteNote,
} = require("../controllers/noteControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.get("/trash", getTrashNotes);
router.patch("/:id/pin", togglePinNote);
router.patch("/:id/archive", toggleArchiveNote);
router.patch("/:id/restore", restoreNote);
router.delete("/:id/permanent", permanentlyDeleteNote);
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
