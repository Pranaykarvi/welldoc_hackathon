"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Patient } from "@/lib/data"

export function RiskBarChart({ patients }: { patients: Patient[] }) {
  const low = patients.filter((p) => p.risk_level === "Low").length
  const med = patients.filter((p) => p.risk_level === "Medium").length
  const high = patients.filter((p) => p.risk_level === "High").length
  const data = [
    { level: "Low", count: low },
    { level: "Medium", count: med },
    { level: "High", count: high },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="level" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" allowDecimals={false} />
          <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
          <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
