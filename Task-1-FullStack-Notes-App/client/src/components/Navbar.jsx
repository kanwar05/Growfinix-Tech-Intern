import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { FiEdit3, FiHome, FiLogOut, FiPlus } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast({ type: "success", title: "Logged out" });
      navigate("/login", { replace: true });
    } catch (error) {
      showToast({
        type: "error",
        title: "Logout failed",
        message: error.message,
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
      <Link to="/" className="flex items-center gap-3 font-black tracking-tight" aria-label="Notes dashboard">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-glow">
          <FiEdit3 aria-hidden="true" />
        </span>
        <span className="text-lg">NoteFlow</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Primary navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <FiHome aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink
          to="/notes/new"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <FiPlus aria-hidden="true" /> Create
        </NavLink>
      </nav>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <ThemeToggle />
        <span className="max-w-52 truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" title={user?.email}>
          {user?.email}
        </span>
        <Button variant="ghost" onClick={handleLogout} className="px-3">
          <FiLogOut aria-hidden="true" /> Logout
        </Button>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
