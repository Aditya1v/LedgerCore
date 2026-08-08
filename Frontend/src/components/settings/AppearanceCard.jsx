function AppearanceCard() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        Appearance
      </h2>

      <p className="mt-2 text-slate-400">
        Theme customization will be available in a future update.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-600 bg-slate-900 p-4">
        <p className="text-sm text-slate-400">
          🚧 Coming Soon
        </p>
      </div>
    </div>
  );
}

export default AppearanceCard;