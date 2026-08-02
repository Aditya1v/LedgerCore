import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";

function Sidebar() {
  return (
    <aside className="min-h-[calc(100vh-64px)] w-64 border-r border-slate-800 bg-slate-900 p-6">

      <nav className="space-y-2">

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;