import Card from "../ui/Card";

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-50">
            {value}
          </h2>
        </div>

        {/* Right Section */}
        <div className="rounded-xl bg-slate-700 p-3">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default DashboardCard;