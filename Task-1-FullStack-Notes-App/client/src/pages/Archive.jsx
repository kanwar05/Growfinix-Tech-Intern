import { useEffect, useState } from "react";
import { FiArchive } from "react-icons/fi";
import {
  deleteNote,
  fetchNotes,
  toggleArchiveNote,
  togglePinNote,
} from "../api/notesApi";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import NoteCard from "../components/NoteCard";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/useToast";

const Archive = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pinningNoteId, setPinningNoteId] = useState(null);
  const [archivingNoteId, setArchivingNoteId] = useState(null);

  useEffect(() => {
    const loadArchivedNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchNotes({ archived: "true" });
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
        showToast({
          type: "error",
          title: "Could not load archive",
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadArchivedNotes();
  }, [showToast]);

  const sortPinnedFirst = (noteList) =>
    [...noteList].sort((first, second) => {
      if (first.isPinned !== second.isPinned) {
        return Number(second.isPinned) - Number(first.isPinned);
      }

      return new Date(second.updatedAt) - new Date(first.updatedAt);
    });

  const handleTogglePin = async (note) => {
    setPinningNoteId(note._id);

    try {
      const data = await togglePinNote(note._id);
      setNotes((currentNotes) =>
        sortPinnedFirst(
          currentNotes.map((currentNote) =>
            currentNote._id === note._id ? data.note : currentNote,
          ),
        ),
      );
      showToast({
        type: "success",
        title: data.note.isPinned ? "Note pinned" : "Note unpinned",
      });
    } catch (err) {
      showToast({ type: "error", title: "Pin update failed", message: err.message });
    } finally {
      setPinningNoteId(null);
    }
  };

  const handleToggleArchive = async (note) => {
    setArchivingNoteId(note._id);

    try {
      const data = await toggleArchiveNote(note._id);
      setNotes((currentNotes) =>
        currentNotes.filter((currentNote) => currentNote._id !== note._id),
      );
      showToast({
        type: "success",
        title: data.note.isArchived ? "Note archived" : "Note unarchived",
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Archive update failed",
        message: err.message,
      });
    } finally {
      setArchivingNoteId(null);
    }
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    setDeleting(true);

    try {
      await deleteNote(noteToDelete._id);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== noteToDelete._id),
      );
      showToast({ type: "success", title: "Note moved to trash" });
      setNoteToDelete(null);
    } catch (err) {
      showToast({ type: "error", title: "Delete failed", message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="grid gap-8">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
          <FiArchive aria-hidden="true" /> Archive
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Archived notes
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Restore older notes when you need them, or delete them permanently.
        </p>
      </div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <EmptyState
          title="Archive is empty"
          description="Archived notes will appear here. Use Archive on a note card or details page to move it out of your dashboard."
          actionLabel="Back to dashboard"
          actionTo="/"
        />
      )}

      {!loading && notes.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={setNoteToDelete}
              onTogglePin={handleTogglePin}
              onToggleArchive={handleToggleArchive}
              pinning={pinningNoteId === note._id}
              archiving={archivingNoteId === note._id}
            />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(noteToDelete)}
        title="Move this note to trash?"
        description={`"${noteToDelete?.title}" will leave your archive, but you can restore it from Trash.`}
        confirmLabel="Move to trash"
        loading={deleting}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default Archive;
