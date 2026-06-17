import { Link } from "react-router-dom";
import { FiFileText, FiPlus } from "react-icons/fi";

const EmptyState = ({ title, description, actionLabel, actionTo }) => {
  return (
    <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/60">
      <div className="grid max-w-md place-items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
          <FiFileText aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:from-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20">
            <FiPlus aria-hidden="true" /> {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
