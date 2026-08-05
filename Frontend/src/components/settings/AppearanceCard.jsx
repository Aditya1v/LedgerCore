function AppearanceCard({ settings, setSettings }) {
  const themes = ["LIGHT", "DARK", "SYSTEM"];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        Appearance
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Choose your preferred theme.
      </p>

      <div className="mt-6 space-y-3">
        {themes.map((theme) => (
          <label
            key={theme}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="radio"
              name="theme"
              value={theme}
              checked={settings.theme === theme}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  theme: e.target.value,
                }))
              }
            />

            <span className="text-white">
              {theme}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default AppearanceCard;