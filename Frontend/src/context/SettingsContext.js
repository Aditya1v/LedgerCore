import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { getSettings, updateSettings } from "../services/settingsService";

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  theme: "SYSTEM",
  currency: "INR",
  emailNotifications: true,
  transactionAlerts: true,
  marketingEmails: false,
};

function applyTheme(theme) {
  const root = document.documentElement;
  const normalized = String(theme || "SYSTEM").toLowerCase();

  root.dataset.theme = normalized;
}

function persistSettings(settings) {
  localStorage.setItem(
    "ledgercore-settings",
    JSON.stringify(settings)
  );

  applyTheme(settings.theme);
}

export function SettingsProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("ledgercore-settings");

      return stored
        ? {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(stored),
          }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function loadSettings() {
      try {
        setLoading(true);

        const response = await getSettings();

        if (!cancelled) {
          const next = {
            ...DEFAULT_SETTINGS,
            ...(response?.data || {}),
          };

          setSettings(next);
          persistSettings(next);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      loading,
      saving,

      async saveSettings(nextSettings = settings) {
        setSaving(true);

        try {
          const response = await updateSettings(nextSettings);

          const next = {
            ...DEFAULT_SETTINGS,
            ...(response?.data || {}),
          };

          setSettings(next);
          persistSettings(next);

          return next;
        } finally {
          setSaving(false);
        }
      },
    }),
    [settings, loading, saving]
  );

  return createElement(
    SettingsContext.Provider,
    { value },
    children
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}