export function RiskGauge({
  score,
  level,
  confidence,
}: { score: number; level: "Low" | "Medium" | "High"; confidence: "Low" | "Medium" | "High" }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = level === "High" ? "#EF4444" : level === "Medium" ? "#F59E0B" : "#10B981"

  return (
    <div className="flex items-center gap-4">
      <svg width="150" height="150" viewBox="0 0 150 150" className="block">
        <circle cx="75" cy="75" r={radius} stroke="#1F2937" strokeWidth="14" fill="none" />
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#E5E7EB"
          fontSize="22"
          fontWeight="600"
        >
          {score}%
        </text>
      </svg>
      <div>
        <div className="text-gray-300">Level</div>
        <div className="text-xl font-semibold">{level}</div>
        <div className="mt-2 text-gray-300">Confidence</div>
        <div className="font-medium">{confidence}</div>
      </div>
    </div>
  )
}
