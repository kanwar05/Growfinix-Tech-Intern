import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import {
  FiBold,
  FiCode,
  FiHash,
  FiItalic,
  FiLink,
  FiList,
  FiMinus,
  FiSave,
  FiX,
} from "react-icons/fi";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

const emptyNote = {
  title: "",
  content: "",
  category: "general",
  tags: "",
};

const markdownTools = [
  { label: "Bold", icon: FiBold, action: "bold" },
  { label: "Italic", icon: FiItalic, action: "italic" },
  { label: "Heading", icon: FiHash, action: "heading" },
  { label: "List", icon: FiList, action: "list" },
  { label: "Code block", icon: FiCode, action: "code" },
  { label: "Link", icon: FiLink, action: "link" },
  { label: "Quote", icon: FiHash, action: "quote" },
  { label: "Horizontal rule", icon: FiMinus, action: "rule" },
];

const NoteForm = ({ initialNote, submitLabel, onSubmit, error, success }) => {
  const [form, setForm] = useState(() => ({
    ...emptyNote,
    ...initialNote,
    tags: Array.isArray(initialNote?.tags)
      ? initialNote.tags.join(", ")
      : initialNote?.tags || "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const tags = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        title: form.title,
        content: form.content,
        category: form.category,
        tags,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateContent = (nextContent, selectionStart, selectionEnd) => {
    setForm((current) => ({ ...current, content: nextContent }));

    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(selectionStart, selectionEnd);
    }, 0);
  };

  const insertMarkdown = ({ prefix = "", suffix = "", placeholder = "", block = false }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.slice(start, end);
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const text = selectedText || placeholder;
    const leadingBreak = block && before && !before.endsWith("\n") ? "\n" : "";
    const trailingBreak = block && after && !after.startsWith("\n") ? "\n" : "";
    const insertion = `${leadingBreak}${prefix}${text}${suffix}${trailingBreak}`;
    const nextStart = before.length + leadingBreak.length + prefix.length;
    const nextEnd = nextStart + text.length;

    updateContent(`${before}${insertion}${after}`, nextStart, nextEnd);
  };

  const insertList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.slice(start, end);
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const lines = selectedText
      ? selectedText.split("\n").map((line) => `- ${line || "List item"}`)
      : ["- First item", "- Second item"];
    const leadingBreak = before && !before.endsWith("\n") ? "\n" : "";
    const trailingBreak = after && !after.startsWith("\n") ? "\n" : "";
    const insertion = `${leadingBreak}${lines.join("\n")}${trailingBreak}`;
    const nextStart = before.length + leadingBreak.length + 2;
    const nextEnd = nextStart + (selectedText ? selectedText.length : "First item".length);

    updateContent(`${before}${insertion}${after}`, nextStart, nextEnd);
  };

  const handleToolbarAction = (action) => {
    if (action === "bold") {
      insertMarkdown({ prefix: "**", suffix: "**", placeholder: "bold text" });
    } else if (action === "italic") {
      insertMarkdown({ prefix: "_", suffix: "_", placeholder: "italic text" });
    } else if (action === "heading") {
      insertMarkdown({ prefix: "## ", placeholder: "Heading", block: true });
    } else if (action === "list") {
      insertList();
    } else if (action === "code") {
      insertMarkdown({
        prefix: "```\n",
        suffix: "\n```",
        placeholder: "code here",
        block: true,
      });
    } else if (action === "link") {
      insertMarkdown({
        prefix: "[",
        suffix: "](https://example.com)",
        placeholder: "link text",
      });
    } else if (action === "quote") {
      insertMarkdown({ prefix: "> ", placeholder: "Quote", block: true });
    } else if (action === "rule") {
      insertMarkdown({ prefix: "---", block: true });
    }
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-300">
          {success}
        </div>
      )}

      <Card className="grid gap-5 p-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project ideas"
            maxLength={120}
            required
          />
          <Input
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="work"
          />
        </div>

        <Input
          label="Tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="react, backend, ideas"
          helper="Separate tags with commas."
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <span>Content</span>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            {markdownTools.map(({ label, icon: Icon, action }) => (
              <button
                aria-label={label}
                className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-200"
                key={label}
                onClick={() => handleToolbarAction(action)}
                title={label}
                type="button"
              >
                <Icon aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <textarea
            className="min-h-[26rem] w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 leading-7 text-slate-950 outline-none shadow-soft transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            name="content"
            ref={textareaRef}
            value={form.content}
            onChange={handleChange}
            placeholder="Write Markdown here..."
            rows={16}
            required
          />
        </label>

        <Card
          className="min-h-[26rem] overflow-hidden"
          as="section"
          aria-label="Markdown preview"
        >
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            Preview
          </div>
          <div className="markdown-surface p-5">
            <ReactMarkdown>
              {form.content || "Your Markdown preview will appear here."}
            </ReactMarkdown>
          </div>
        </Card>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <FiX aria-hidden="true" /> Cancel
        </Link>
        <Button type="submit" variant="primary" disabled={submitting}>
          <FiSave aria-hidden="true" />
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
