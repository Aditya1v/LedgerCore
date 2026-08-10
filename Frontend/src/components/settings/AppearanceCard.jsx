import { Palette } from "lucide-react";
import Card from "../ui/Card";

function AppearanceCard() {
  return (
    <Card id="appearance">
      <div className="flex items-center gap-2.5">
        <Palette size={18} className="text-accent-hover" />
        <h2 className="text-[16px] font-semibold text-ink">Appearance</h2>
      </div>

      <p className="mt-2 text-sm text-ink-faint">
        Theme customization will be available in a future update.
      </p>

      <div className="mt-5 rounded-control border border-dashed border-line-strong bg-surface-2 px-4 py-3">
        <p className="text-xs font-medium text-ink-faint">Coming soon</p>
      </div>
    </Card>
  );
}

export default AppearanceCard;
