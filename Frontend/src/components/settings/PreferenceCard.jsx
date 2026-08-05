function PreferenceCard({ settings, setSettings }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        Preferences
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Configure your preferred currency.
      </p>

      <select
        value={settings.currency}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev,
            currency: e.target.value,
          }))
        }
        className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
      >
        <option value="INR">INR (₹)</option>
        <option value="USD">$ USD</option>
        <option value="EUR">€ EUR</option>
        <option value="GBP">£ GBP</option>
      </select>
    </div>
  );
}

export default PreferenceCard;