import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BellRing, Coins, Info, Palette } from "lucide-react";

import AppearanceCard from "../../components/settings/AppearanceCard";
import PreferenceCard from "../../components/settings/PreferenceCard";
import NotificationCard from "../../components/settings/NotificationCard";
import AboutCard from "../../components/settings/AboutCard";

import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Loader";

import { getSettings, updateSettings } from "../../services/settingsService";

import { refreshCurrencyRates } from "../../utils/formatCurrency";

const DEFAULT_SETTINGS = {
  theme: "SYSTEM",
  currency: "INR",
  emailNotifications: true,
  transactionAlerts: true,
  marketingEmails: false,
};

const SECTIONS = [
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Coins,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: BellRing,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
  },
];

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await getSettings();

      const nextSettings = {
        ...DEFAULT_SETTINGS,
        ...(response?.data || {}),
      };

      setSettings(nextSettings);

      localStorage.setItem("ledgercore-settings", JSON.stringify(nextSettings));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      await refreshCurrencyRates();

      const response = await updateSettings(settings);

      const savedSettings = {
        ...DEFAULT_SETTINGS,
        ...(response?.data || settings),
      };

      localStorage.setItem(
        "ledgercore-settings",
        JSON.stringify(savedSettings),
      );

      toast.success("Settings updated successfully.");

      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Settings"
          subtitle="Manage your application preferences."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences."
        action={
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <Icon size={15} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          <AppearanceCard settings={settings} setSettings={setSettings} />

          <PreferenceCard settings={settings} setSettings={setSettings} />

          <NotificationCard settings={settings} setSettings={setSettings} />

          <AboutCard />
        </div>
      </div>
    </PageContainer>
  );
}

export default Settings;
