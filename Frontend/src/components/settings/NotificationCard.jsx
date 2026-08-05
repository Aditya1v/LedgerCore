function NotificationCard({ settings, setSettings }) {
  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        Notifications
      </h2>

      <div className="mt-6 space-y-5">
        <label className="flex items-center justify-between text-white">
          Email Notifications

          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => toggle("emailNotifications")}
          />
        </label>

        <label className="flex items-center justify-between text-white">
          Transaction Alerts

          <input
            type="checkbox"
            checked={settings.transactionAlerts}
            onChange={() => toggle("transactionAlerts")}
          />
        </label>

        <label className="flex items-center justify-between text-white">
          Marketing Emails

          <input
            type="checkbox"
            checked={settings.marketingEmails}
            onChange={() => toggle("marketingEmails")}
          />
        </label>
      </div>
    </div>
  );
}

export default NotificationCard;