import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArchive, FiArrowLeft, FiEdit3, FiMapPin, FiTrash2 } from "react-icons/fi";
import { deleteNote, fetchNote, toggleArchiveNote } from "../api/notesApi";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/useToast";
import { formatDate } from "../utils/formatDate";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchNote(id);
        setNote(data.note);
      } catch (err) {
        setError(err.message);
        showToast({ type: "error", title: "Could not load note", message: err.message });
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id, showToast]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await deleteNote(id);
      showToast({ type: "success", title: "Note deleted" });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      showToast({ type: "error", title: "Delete failed", message: err.message });
      setDeleting(false);
    }
  };

  const handleToggleArchive = async () => {
    setArchiving(true);
    setError("");

    try {
      const data = await toggleArchiveNote(id);
      setNote(data.note);
      showToast({
        type: "success",
        title: data.note.isArchived ? "Note archived" : "Note unarchived",
      });
    } catch (err) {
      setError(err.message);
      showToast({
        type: "error",
        title: "Archive update failed",
        message: err.message,
      });
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!note) {
    return (
      <EmptyState
        title="Note not found"
        description={error || "This note does not exist or you do not own it."}
        actionLabel="Back to dashboard"
        actionTo="/"
      />
    );
  }

  return (
    <article className="grid gap-7">
      <Link
        to={note.isArchived ? "/archive" : "/"}
        className="inline-flex w-fit items-center gap-2 rounded-full px-1 text-sm font-bold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
      >
        <FiArrowLeft aria-hidden="true" />
        Back to {note.isArchived ? "archive" : "dashboard"}
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            {note.category || "general"}
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Created {formatDate(note.createdAt)} - Updated {formatDate(note.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/notes/${note._id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-blue-950/40"
          >
            <FiEdit3 aria-hidden="true" /> Edit
          </Link>
          <Button
            variant={note.isArchived ? "soft" : "default"}
            onClick={handleToggleArchive}
            disabled={archiving}
          >
            <FiArchive aria-hidden="true" />
            {archiving ? "Updating..." : note.isArchived ? "Unarchive" : "Archive"}
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            <FiTrash2 aria-hidden="true" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {note.isArchived && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <FiArchive aria-hidden="true" /> Archived
          </span>
        )}
        {note.isPinned && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <FiMapPin aria-hidden="true" /> Pinned
          </span>
        )}
        {note.tags?.length ? (
          note.tags.map((tag) => (
            <span
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              key={tag}
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No tags
          </span>
        )}
      </div>

      <section className="markdown-surface rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </section>

      <Modal
        open={showDeleteModal}
        title="Delete this note?"
        description={`"${note.title}" will be permanently removed.`}
        confirmLabel="Delete note"
        loading={deleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </article>
  );
};

export default NoteDetails;
