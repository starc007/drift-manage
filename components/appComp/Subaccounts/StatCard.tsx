import { StatCardProps } from "./types";

export const StatCard = ({
  label,
  value,
  valueColor = "text-white",
}: StatCardProps) => (
  <div className="bg-primary/5 rounded-xl p-5">
    <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
      {label}
    </p>
    <p className={`text-xl font-semibold pt-2 ${valueColor}`}>{value}</p>
  </div>
);
