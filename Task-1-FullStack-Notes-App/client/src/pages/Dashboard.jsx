import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiSliders } from "react-icons/fi";
import {
  deleteNote,
  fetchNotes,
  toggleArchiveNote,
  togglePinNote,
} from "../api/notesApi";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import Modal from "../components/Modal";
import NoteCard from "../components/NoteCard";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/useToast";

const Dashboard = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [filters, setFilters] = useState({ search: "", tag: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pinningNoteId, setPinningNoteId] = useState(null);
  const [archivingNoteId, setArchivingNoteId] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value.trim()),
        );
        const data = await fetchNotes(params);
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
        showToast({ type: "error", title: "Could not load notes", message: err.message });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadNotes, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters, showToast]);

  const availableTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((note) => note.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const categories = useMemo(() => {
    const categorySet = new Set(notes.map((note) => note.category).filter(Boolean));
    return Array.from(categorySet).sort();
  }, [notes]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const setChipFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: current[name] === value ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters({ search: "", tag: "", category: "" });
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

  return (
    <section className="grid gap-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            Dashboard
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Your notes
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Search, filter, preview, and manage private notes.
          </p>
        </div>
        <Link
          to="/notes/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
        >
          <FiPlus aria-hidden="true" /> New note
        </Link>
      </div>

      <section
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
        aria-label="Note filters"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <FiSliders aria-hidden="true" />
          Filters
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-4 top-[2.65rem] text-slate-400"
              aria-hidden="true"
            />
            <Input
              className="[&_input]:pl-11"
              label="Search"
              name="search"
              value={filters.search}
              onChange={updateFilter}
              placeholder="Search title or content"
            />
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>Tag</span>
            <select
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              name="tag"
              value={filters.tag}
              onChange={updateFilter}
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>Category</span>
            <select
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              name="category"
              value={filters.category}
              onChange={updateFilter}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Quick filters">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filters.category === category ? "primary" : "soft"}
              onClick={() => setChipFilter("category", category)}
            >
              {category}
            </Button>
          ))}
          {availableTags.slice(0, 8).map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant={filters.tag === tag ? "primary" : "soft"}
              onClick={() => setChipFilter("tag", tag)}
            >
              #{tag}
            </Button>
          ))}
          {(filters.search || filters.tag || filters.category) && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </section>

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
          title="No notes found"
          description="Create your first note or adjust the filters to find another one."
          actionLabel="Create note"
          actionTo="/notes/new"
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
        description={`"${noteToDelete?.title}" will leave your dashboard, but you can restore it from Trash.`}
        confirmLabel="Move to trash"
        loading={deleting}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default Dashboard;
