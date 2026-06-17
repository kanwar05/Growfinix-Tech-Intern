import { cn } from "../utils/cn";

const variants = {
  default:
    "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-blue-950/40",
  primary:
    "border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow hover:from-blue-500 hover:to-cyan-400",
  soft:
    "border-transparent bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/60",
  ghost:
    "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  danger:
    "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/50",
};

const sizes = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  type = "button",
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 active:scale-[0.98]",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
