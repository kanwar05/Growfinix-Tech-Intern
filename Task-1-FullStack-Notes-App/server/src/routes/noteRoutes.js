const express = require("express");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
} = require("../controllers/noteControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.patch("/:id/pin", togglePinNote);
router.patch("/:id/archive", toggleArchiveNote);
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
