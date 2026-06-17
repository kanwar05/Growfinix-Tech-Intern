import { cn } from "../utils/cn";

const Card = ({ children, className = "", as: Component = "div", ...props }) => {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-slate-200 bg-white/90 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
