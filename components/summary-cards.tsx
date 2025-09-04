import { Card, CardContent } from "@/components/ui/card"
import type { Patient } from "@/lib/data"

export function SummaryCards({ patients }: { patients: Patient[] }) {
  const total = patients.length
  const high = patients.filter((p) => p.risk_level === "High").length
  const avg = patients.length ? Math.round(patients.reduce((a, b) => a + b.risk_score, 0) / patients.length) : 0

  const items = [
    { label: "Total Patients", value: total, color: "text-white" },
    { label: "% High Risk", value: total ? Math.round((high / total) * 100) + "%" : "0%", color: "text-red-400" },
    { label: "Average Risk Score", value: avg, color: "text-emerald-400" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label} className="bg-gray-900 border-0 rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">{it.label}</div>
            <div className={`text-2xl font-semibold mt-2 ${it.color}`}>{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
