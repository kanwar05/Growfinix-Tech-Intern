import { useEffect, useState } from "react";
import { FiArrowUpCircle, FiTrash2 } from "react-icons/fi";
import { fetchTrashNotes, permanentlyDeleteNote, restoreNote } from "../api/notesApi";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/useToast";
import { formatDate } from "../utils/formatDate";

const Trash = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringNoteId, setRestoringNoteId] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTrash = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTrashNotes();
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
        showToast({
          type: "error",
          title: "Could not load trash",
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrash();
  }, [showToast]);

  const handleRestore = async (note) => {
    setRestoringNoteId(note._id);

    try {
      await restoreNote(note._id);
      setNotes((currentNotes) =>
        currentNotes.filter((currentNote) => currentNote._id !== note._id),
      );
      showToast({ type: "success", title: "Note restored" });
    } catch (err) {
      showToast({ type: "error", title: "Restore failed", message: err.message });
    } finally {
      setRestoringNoteId(null);
    }
  };

  const confirmPermanentDelete = async () => {
    if (!noteToDelete) return;

    setDeleting(true);

    try {
      await permanentlyDeleteNote(noteToDelete._id);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== noteToDelete._id),
      );
      showToast({ type: "success", title: "Note permanently deleted" });
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
          <FiTrash2 aria-hidden="true" /> Trash
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Deleted notes
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Restore notes back to your workspace, or delete them forever.
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
          title="Trash is empty"
          description="Deleted notes will appear here before they are permanently removed."
          actionLabel="Back to dashboard"
          actionTo="/"
        />
      )}

      {!loading && notes.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card
              as="article"
              className="grid min-h-72 gap-4 border-red-200 p-5 dark:border-red-900/60"
              key={note._id}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-red-50 px-3 text-xs font-black uppercase tracking-wide text-red-700 dark:bg-red-950/50 dark:text-red-300">
                  <FiTrash2 aria-hidden="true" /> Trashed
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {note.trashedAt ? `Trashed ${formatDate(note.trashedAt)}` : "In trash"}
                </span>
              </div>

              <h2 className="text-xl font-black leading-tight text-slate-950 dark:text-white">
                {note.title}
              </h2>

              <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {note.content}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => handleRestore(note)}
                  disabled={restoringNoteId === note._id}
                >
                  <FiArrowUpCircle aria-hidden="true" />
                  {restoringNoteId === note._id ? "Restoring..." : "Restore"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => setNoteToDelete(note)}>
                  <FiTrash2 aria-hidden="true" /> Delete forever
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(noteToDelete)}
        title="Delete forever?"
        description={`"${noteToDelete?.title}" will be permanently deleted and cannot be restored.`}
        confirmLabel="Delete forever"
        loading={deleting}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmPermanentDelete}
      />
    </section>
  );
};

export default Trash;
