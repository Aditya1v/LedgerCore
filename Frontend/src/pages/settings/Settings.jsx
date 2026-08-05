import { useEffect, useState } from "react";
import { toast } from "sonner";

import AppearanceCard from "../../components/settings/AppearanceCard";
import PreferenceCard from "../../components/settings/PreferenceCard";
import NotificationCard from "../../components/settings/NotificationCard";
import AboutCard from "../../components/settings/AboutCard";

import {
  getSettings,
  updateSettings,
} from "../../services/settingsService";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "SYSTEM",
    currency: "INR",
    emailNotifications: true,
    transactionAlerts: true,
    marketingEmails: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await getSettings();

      setSettings(response.data);
      console.log("Settings State:", response.data);
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

      await updateSettings(settings);

      toast.success("Settings updated successfully.");
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
      <div className="flex justify-center py-20 text-white">
        Loading Settings...
      </div>
    );
  }
console.log("Current Settings:", settings);
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-5xl font-bold text-white">
        Settings
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your application preferences.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
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

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Settings;
