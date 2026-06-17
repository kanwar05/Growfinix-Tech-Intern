import { cn } from "../utils/cn";

const Input = ({ label, helper, id, className = "", ...props }) => {
  const inputId = id || props.name;

  return (
    <label className={cn("grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100", className)} htmlFor={inputId}>
      <span>{label}</span>
      <input
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        id={inputId}
        {...props}
      />
      {helper && <small className="text-xs font-medium text-slate-500 dark:text-slate-400">{helper}</small>}
    </label>
  );
};

export default Input;
