import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import {
  FiArchive,
  FiEdit3,
  FiHome,
  FiLogOut,
  FiPlus,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";

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
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <FiArchive aria-hidden="true" /> Archive
        </NavLink>
        <NavLink
          to="/trash"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <FiTrash2 aria-hidden="true" /> Trash
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <FiSettings aria-hidden="true" /> Settings
        </NavLink>
      </nav>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <ThemeToggle />
        <Link
          to="/settings"
          className="inline-flex max-w-64 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40"
          title={user?.email}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-xs font-black text-white">
            {user?.avatar ? (
              <img alt="" className="h-full w-full object-cover" src={user.avatar} />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() ||
              user?.email?.charAt(0)?.toUpperCase()
            )}
          </span>
          {/* <span className="truncate">{user?.name || user?.email}</span> */}
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="px-3">
          <FiLogOut aria-hidden="true" /> Logout
        </Button>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
