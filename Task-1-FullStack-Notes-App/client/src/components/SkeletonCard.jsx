const SkeletonCard = () => {
  return (
    <article
      className="min-h-72 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/90"
      aria-label="Loading note"
    >
      <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-7 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-5 space-y-3">
        <div className="h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-10 h-8 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
    </article>
  );
};

export default SkeletonCard;
