import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchNote, updateNote } from "../api/notesApi";
import EmptyState from "../components/EmptyState";
import NoteForm from "../components/NoteForm";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/useToast";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadNote = async () => {
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

  const handleUpdate = async (payload) => {
    setError("");
    setSuccess("");

    try {
      await updateNote(id, payload);
      setSuccess("Note updated successfully");
      showToast({ type: "success", title: "Note updated" });
      navigate(`/notes/${id}`);
    } catch (err) {
      setError(err.message);
      showToast({ type: "error", title: "Update failed", message: err.message });
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
        title="Note unavailable"
        description={error || "The note could not be loaded."}
        actionLabel="Back to dashboard"
        actionTo="/"
      />
    );
  }

  return (
    <section className="grid gap-8">
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            Edit
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            <Link className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-300" to={`/notes/${id}`}>
              Back to note details
            </Link>
          </p>
        </div>
      </div>
      <NoteForm
        initialNote={note}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        error={error}
        success={success}
      />
    </section>
  );
};

export default EditNote;
