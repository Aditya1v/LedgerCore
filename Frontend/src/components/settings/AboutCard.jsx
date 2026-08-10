import { Info } from "lucide-react";
import Card from "../ui/Card";

const DETAILS = [
  { label: "Version", value: "1.0.0" },
  { label: "Stack", value: "MERN" },
  { label: "Developer", value: "Aditya Verma" },
];

function AboutCard() {
  return (
    <Card id="about">
      <div className="flex items-center gap-2.5">
        <Info size={18} className="text-accent-hover" />
        <h2 className="text-[16px] font-semibold text-ink">About LedgerCore</h2>
      </div>

      <div className="mt-5 divide-y divide-line">
        {DETAILS.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-faint">{item.label}</span>
            <span className="font-medium text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AboutCard;
