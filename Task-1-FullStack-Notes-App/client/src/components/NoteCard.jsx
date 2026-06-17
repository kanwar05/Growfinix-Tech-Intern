import { Link } from "react-router-dom";
import { FiArchive, FiEdit3, FiEye, FiMapPin, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../utils/formatDate";
import Button from "./Button";
import Card from "./Card";

const NoteCard = ({
  note,
  onDelete,
  onTogglePin,
  onToggleArchive,
  pinning = false,
  archiving = false,
}) => {
  return (
    <Card
      as="article"
      className={`group grid min-h-72 gap-4 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-glow dark:hover:border-blue-900 ${
        note.isPinned ? "border-blue-300 ring-2 ring-blue-500/10 dark:border-blue-800" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {note.isPinned && (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-blue-50 px-3 text-xs font-black uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <FiMapPin aria-hidden="true" /> Pinned
            </span>
          )}
          {note.isArchived && (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-amber-50 px-3 text-xs font-black uppercase tracking-wide text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <FiArchive aria-hidden="true" /> Archived
            </span>
          )}
          <span className="inline-flex min-h-7 items-center rounded-full bg-emerald-50 px-3 text-xs font-black uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            {note.category || "general"}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Updated {formatDate(note.updatedAt)}
        </span>
      </div>

      <Link
        to={`/notes/${note._id}`}
        className="text-xl font-black leading-tight text-slate-950 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300"
      >
        {note.title}
      </Link>

      <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {note.content}
      </p>

      <div className="flex flex-wrap gap-2">
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

      <div className="mt-auto flex flex-wrap gap-2 pt-2" aria-label={`Actions for ${note.title}`}>
        <Button
          size="sm"
          variant={note.isPinned ? "soft" : "default"}
          onClick={() => onTogglePin(note)}
          disabled={pinning}
          aria-pressed={note.isPinned}
        >
          <FiMapPin aria-hidden="true" />
          {pinning ? "Updating..." : note.isPinned ? "Unpin" : "Pin"}
        </Button>
        <Button
          size="sm"
          variant={note.isArchived ? "soft" : "default"}
          onClick={() => onToggleArchive(note)}
          disabled={archiving}
          aria-pressed={note.isArchived}
        >
          <FiArchive aria-hidden="true" />
          {archiving ? "Updating..." : note.isArchived ? "Unarchive" : "Archive"}
        </Button>
        <Link
          to={`/notes/${note._id}`}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-blue-950/40"
        >
          <FiEye aria-hidden="true" /> View
        </Link>
        <Link
          to={`/notes/${note._id}/edit`}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <FiEdit3 aria-hidden="true" /> Edit
        </Link>
        <Button size="sm" variant="danger" onClick={() => onDelete(note)}>
          <FiTrash2 aria-hidden="true" /> Delete
        </Button>
      </div>
    </Card>
  );
};

export default NoteCard;
