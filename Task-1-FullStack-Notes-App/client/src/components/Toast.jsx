import Button from "./Button";
import { cn } from "../utils/cn";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

const Toast = ({ toast, onClose }) => {
  const isError = toast.type === "error";
  const Icon = isError ? FiXCircle : toast.type === "success" ? FiCheckCircle : FiInfo;

  return (
    <section
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-2xl border bg-white/95 p-4 shadow-2xl backdrop-blur dark:bg-slate-900/95",
        isError
          ? "border-red-200 text-red-700 dark:border-red-900/70 dark:text-red-300"
          : "border-emerald-200 text-emerald-700 dark:border-emerald-900/70 dark:text-emerald-300",
      )}
      role="status"
    >
      <Icon className="mt-0.5 text-xl" aria-hidden="true" />
      <div>
        <strong className="block text-sm font-bold text-slate-950 dark:text-white">{toast.title}</strong>
        {toast.message && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{toast.message}</p>}
      </div>
      <Button
        aria-label="Dismiss notification"
        className="min-h-8 w-8 px-0 py-0"
        size="sm"
        variant="ghost"
        onClick={() => onClose(toast.id)}
      >
        <FiX aria-hidden="true" />
      </Button>
    </section>
  );
};

export default Toast;
