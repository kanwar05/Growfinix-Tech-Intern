import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../api/notesApi";
import NoteForm from "../components/NoteForm";
import { useToast } from "../context/useToast";

const CreateNote = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (payload) => {
    setError("");
    setSuccess("");

    try {
      const data = await createNote(payload);
      setSuccess("Note created successfully");
      showToast({ type: "success", title: "Note created" });
      navigate(`/notes/${data.note._id}`);
    } catch (err) {
      setError(err.message);
      showToast({ type: "error", title: "Create failed", message: err.message });
    }
  };

  return (
    <section className="grid gap-8">
      <div>
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            Create
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            New note
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Write in Markdown and preview the result live.
          </p>
        </div>
      </div>
      <NoteForm
        submitLabel="Create note"
        onSubmit={handleCreate}
        error={error}
        success={success}
      />
    </section>
  );
};

export default CreateNote;
