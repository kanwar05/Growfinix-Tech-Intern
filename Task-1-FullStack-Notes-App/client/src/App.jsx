import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import Archive from "./pages/Archive";
import CreateNote from "./pages/CreateNote";
import Dashboard from "./pages/Dashboard";
import EditNote from "./pages/EditNote";
import Login from "./pages/Login";
import NoteDetails from "./pages/NoteDetails";
import Signup from "./pages/Signup";
import Trash from "./pages/Trash";

const App = () => {
  const { loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <div className="grid place-items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-cyan-400" />
          <p className="text-sm font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/notes/new" element={<CreateNote />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
          <Route path="/notes/:id/edit" element={<EditNote />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
