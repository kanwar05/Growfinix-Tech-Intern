import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32rem),radial-gradient(circle_at_right,rgba(20,184,166,0.12),transparent_28rem)] text-slate-950 dark:bg-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_30rem),radial-gradient(circle_at_right,rgba(14,165,233,0.11),transparent_28rem)] dark:text-slate-100">
      <Navbar />
      <main className="mx-auto w-[min(1180px,calc(100%-2rem))] py-8 sm:py-10 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
