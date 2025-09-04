export function RiskBadge({ score, level }: { score: number; level: "Low" | "Medium" | "High" }) {
  const color =
    level === "High"
      ? "bg-red-500/20 text-red-300"
      : level === "Medium"
        ? "bg-yellow-500/20 text-yellow-300"
        : "bg-emerald-500/20 text-emerald-300"
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ${color}`}>
      <span className="font-medium">{level}</span>
      <span className="text-gray-300">({score})</span>
    </span>
  )
}
