import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-slate-950 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;