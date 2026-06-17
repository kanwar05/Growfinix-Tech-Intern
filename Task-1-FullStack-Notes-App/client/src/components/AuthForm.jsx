import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import Button from "./Button";
import Input from "./Input";

const AuthForm = ({ mode, onSubmit, error }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.20),transparent_26rem)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="absolute left-[8%] top-[14%] hidden h-32 w-48 rotate-[-8deg] rounded-2xl border border-white/70 bg-white/50 shadow-2xl backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/50 sm:block" />
        <div className="absolute bottom-[12%] right-[9%] hidden h-28 w-44 rotate-[7deg] rounded-2xl border border-white/70 bg-white/50 shadow-2xl backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/50 md:block" />
      </aside>

      <form
        className="relative z-10 grid w-[min(28.5rem,100%)] gap-5 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:p-8"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            NoteFlow
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 leading-6 text-slate-600 dark:text-slate-300">
            {isSignup
              ? "Start saving notes with Markdown, tags, and private access."
              : "Sign in to continue to your notes workspace."}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label
          className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
          htmlFor="password"
        >
          <span>Password</span>
          <div className="relative">
            <FiLock
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-11 pr-14 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Minimum 6 characters"
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />
            <Button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 min-h-12 w-12 -translate-y-1/2 px-0 py-0"
              size="sm"
              variant="ghost"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
            </Button>
          </div>
        </label>

        <Button className="w-full" type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? isSignup
              ? "Creating..."
              : "Signing in..."
            : isSignup
              ? "Sign up"
              : "Log in"}
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-300"
            to={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
