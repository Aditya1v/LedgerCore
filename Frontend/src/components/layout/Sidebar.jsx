import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Landmark, X } from "lucide-react";

import { primaryNavigation, accountNavigation } from "../../constants/navigation";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-control px-3 py-2.5 text-[14.5px] font-medium transition-colors duration-150",
          isActive
            ? "bg-accent-soft text-accent-hover"
            : "text-ink-muted hover:bg-surface-2 hover:text-ink"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={2}
            className={cn(isActive ? "text-accent-hover" : "text-ink-faint group-hover:text-ink-muted")}
          />
          {item.name}
        </>
      )}
    </NavLink>
  );
}

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent text-white">
        <Landmark size={17} strokeWidth={2.25} />
      </div>
      <span className="font-display text-[17px] font-bold tracking-tight text-ink">LedgerCore</span>
    </Link>
  );
}

function SidebarContent({ user, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-6 pb-8">
        <Brand />
      </div>

      <nav className="flex-1 space-y-6 px-4">
        <div className="space-y-1">
          {primaryNavigation.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="space-y-1 border-t border-line pt-4">
          {accountNavigation.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      {user && (
        <Link
          to="/profile"
          onClick={onNavigate}
          className="mx-4 mb-4 flex items-center gap-3 rounded-control border border-line bg-surface-2 px-3 py-3 transition-colors hover:border-line-strong hover:bg-surface-3"
        >
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-faint">{user.email}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

/**
 * Desktop: static column, always visible at lg+.
 * Mobile: off-canvas drawer controlled by `isOpen` / `onClose` from
 * DashboardLayout, triggered by the Navbar's menu button.
 */
function Sidebar({ isOpen = false, onClose }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-line bg-elevated lg:flex">
        <SidebarContent user={user} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-elevated lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-3 top-5 rounded-control p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink"
              >
                <X size={20} />
              </button>
              <SidebarContent user={user} onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
