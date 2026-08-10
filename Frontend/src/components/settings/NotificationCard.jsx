import { BellRing } from "lucide-react";
import Card from "../ui/Card";
import Switch from "../ui/Switch";

function NotificationCard({ settings, setSettings }) {
  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card id="notifications">
      <div className="flex items-center gap-2.5">
        <BellRing size={18} className="text-accent-hover" />
        <h2 className="text-[16px] font-semibold text-ink">Notifications</h2>
      </div>

      <div className="mt-6 space-y-5">
        <Switch
          id="emailNotifications"
          label="Email Notifications"
          description="Receive account updates by email."
          checked={settings.emailNotifications}
          onChange={() => toggle("emailNotifications")}
        />

        <Switch
          id="transactionAlerts"
          label="Transaction Alerts"
          description="Get notified for every transfer."
          checked={settings.transactionAlerts}
          onChange={() => toggle("transactionAlerts")}
        />

        <Switch
          id="marketingEmails"
          label="Marketing Emails"
          description="Occasional product news and tips."
          checked={settings.marketingEmails}
          onChange={() => toggle("marketingEmails")}
        />
      </div>
    </Card>
  );
}

export default NotificationCard;
