import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../utils/cn";
import Card from "../ui/Card";

const THEMES = [
  { value: "LIGHT", label: "Light", description: "Bright interface", icon: Sun },
  { value: "DARK", label: "Dark", description: "Dark interface", icon: Moon },
  { value: "SYSTEM", label: "System", description: "Follow device setting", icon: Monitor },
];

function AppearanceCard({ settings, setSettings }) {
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme.toLowerCase();
  }, [settings.theme]);

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  return (
    <Card id="appearance">
      <div className="flex items-center gap-2.5">
        <Palette size={18} className="text-accent-hover" />
        <h2 className="text-[16px] font-semibold text-ink">Appearance</h2>
      </div>

      <p className="mt-2 text-sm text-ink-faint">Choose how LedgerCore should look.</p>

      <div className="mt-5 grid gap-2">
        {THEMES.map(({ value, label, description, icon: Icon }) => {
          const active = settings.theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleThemeChange(value)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-3 rounded-control border px-3.5 py-3 text-left transition-all",
                active
                  ? "border-accent bg-accent-soft shadow-glow-accent"
                  : "border-line-strong bg-surface-2 hover:border-line-strong hover:bg-surface-3"
              )}
            >
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-control", active ? "bg-accent text-white" : "bg-surface-3 text-ink-faint")}>
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{label}</span>
                <span className="block text-xs text-ink-faint">{description}</span>
              </span>
              <span className={cn("h-2.5 w-2.5 rounded-full border", active ? "border-accent bg-accent" : "border-line-strong bg-transparent")} />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default AppearanceCard;
