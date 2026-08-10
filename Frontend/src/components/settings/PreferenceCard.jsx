import { Coins } from "lucide-react";
import Card from "../ui/Card";
import Select from "../ui/Select";

function PreferenceCard({ settings, setSettings }) {
  return (
    <Card id="preferences">
      <div className="flex items-center gap-2.5">
        <Coins size={18} className="text-accent-hover" />
        <h2 className="text-[16px] font-semibold text-ink">Preferences</h2>
      </div>

      <p className="mt-2 text-sm text-ink-faint">Configure your preferred currency.</p>

      <Select
        className="mt-5"
        value={settings.currency}
        onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
      >
        <option value="INR">INR (₹)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </Select>
    </Card>
  );
}

export default PreferenceCard;
