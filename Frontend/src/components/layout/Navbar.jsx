import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Search, Landmark } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";
import { navigation } from "../../constants/navigation";
import Avatar from "../ui/Avatar";
import { useClickOutside } from "../../utils/useClickOutside";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const results = useMemo(() => {
    if (!query.trim()) return navigation;
    return navigation.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query]);

  const goTo = (path) => {
    navigate(path);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-xs sm:block">
      <Search
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) goTo(results[0].path);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Jump to a page..."
        aria-label="Search pages"
        className="h-10 w-full rounded-control border border-line-strong bg-surface-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent focus:ring-4 focus:ring-accent-soft"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-control border border-line-strong bg-surface shadow-modal"
          >
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-ink-faint">No matching pages.</p>
            ) : (
              results.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <Icon size={15} className="text-ink-faint" />
                    {item.name}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <Bell size={18} strokeWidth={2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-11 z-30 w-72 overflow-hidden rounded-card border border-line-strong bg-surface shadow-modal"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Bell size={20} className="text-ink-faint" />
              <p className="text-sm text-ink-faint">You're all caught up. No new notifications.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ onMenuClick }) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-elevated/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
      >
        <Menu size={20} />
      </button>

      <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent text-white">
          <Landmark size={14} strokeWidth={2.25} />
        </div>
      </Link>

      <div className="flex-1">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <NotificationsMenu />

        <div className="mx-1 hidden h-6 w-px bg-line sm:block" />

        <Link to="/profile" className="hidden items-center gap-2.5 rounded-control px-1.5 py-1 transition-colors hover:bg-surface-2 sm:flex">
          <Avatar name={user?.name} size="sm" />
          <span className="max-w-[120px] truncate text-sm font-medium text-ink">{user?.name}</span>
        </Link>

        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-negative-soft hover:text-negative"
        >
          <LogOut size={18} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
