import { useCallback, useMemo, useState } from "react";
import Toast from "../components/Toast";
import { ToastContext } from "./toastContext";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message }) => {
      const id = crypto.randomUUID();
      setToasts((currentToasts) => [
        ...currentToasts,
        { id, type, title, message },
      ]);
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 grid w-[min(24rem,calc(100%-2rem))] gap-3"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
