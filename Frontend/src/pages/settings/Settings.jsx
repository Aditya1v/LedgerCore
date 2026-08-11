import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Loader";

import AppearanceCard from "../../components/settings/AppearanceCard";
import PreferenceCard from "../../components/settings/PreferenceCard";
import NotificationCard from "../../components/settings/NotificationCard";
import AboutCard from "../../components/settings/AboutCard";

import { getSettings, updateSettings } from "../../services/settingsService";
import { refreshCurrencyRates } from "../../utils/formatCurrency";

const DEFAULT_SETTINGS = {
  theme: "SYSTEM",
  currency: "INR",
  emailNotifications: true,
  transactionAlerts: true,
  marketingEmails: false,
};

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

      localStorage.setItem(
        "ledgercore-settings",
        JSON.stringify(nextSettings)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load settings."
      );
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
        JSON.stringify(savedSettings)
      );

      toast.success("Settings updated successfully.");

      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save settings."
      );
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

      {/* Settings Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppearanceCard
          settings={settings}
          setSettings={setSettings}
        />

        <PreferenceCard
          settings={settings}
          setSettings={setSettings}
        />

        <NotificationCard
          settings={settings}
          setSettings={setSettings}
        />

        <AboutCard />
      </div>
    </PageContainer>
  );
}

export default Settings;