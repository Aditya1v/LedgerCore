import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";

function Sidebar() {
  return (
    <aside className="w-64 border-r p-4 flex flex-col gap-2">
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "font-bold text-blue-600" : ""
          }
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;