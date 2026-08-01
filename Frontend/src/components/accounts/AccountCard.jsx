import { Landmark } from "lucide-react";

function AccountCard({ account }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {account.name}
          </h3>

          <p className="text-slate-400 mt-1">
            {account.type}
          </p>
        </div>

        <Landmark className="text-blue-400" size={28} />
      </div>

      <div className="mt-6">
        <p className="text-slate-400 text-sm">
          Available Balance
        </p>

        <h2 className="text-3xl font-bold text-white mt-1">
          ₹{account.balance.toLocaleString()}
        </h2>
      </div>

      <div className="mt-5 flex justify-between text-sm">
        <span className="text-slate-400">
          {account.currency}
        </span>

        <span
          className={`font-semibold ${
            account.status === "ACTIVE"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {account.status}
        </span>
      </div>
    </div>
  );
}

export default AccountCard;