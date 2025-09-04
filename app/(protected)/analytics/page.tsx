"use client"

import { usePatientStore } from "@/lib/store"
import { seedPatients } from "@/lib/data"
import { RiskBarChart } from "@/components/risk-bar-chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const { patients, ensureSeed } = usePatientStore()
  ensureSeed(seedPatients)

  const importance = [
    { feature: "HbA1c", value: 0.34 },
    { feature: "Adherence", value: 0.28 },
    { feature: "BP (sys)", value: 0.18 },
    { feature: "Cholesterol", value: 0.12 },
    { feature: "Creatinine", value: 0.08 },
  ]

  const averages = [
    { day: "D-90", hba1c: 7.9, bmi: 28.5, adherence: 76 },
    { day: "D-60", hba1c: 8.1, bmi: 28.6, adherence: 74 },
    { day: "D-30", hba1c: 8.2, bmi: 28.7, adherence: 71 },
    { day: "Now", hba1c: 8.3, bmi: 28.8, adherence: 70 },
  ]

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-balance">Analytics</h1>

      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <h2 className="text-lg font-medium mb-4">Risk Distribution</h2>
        <RiskBarChart patients={patients} />
      </div>

      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <h2 className="text-lg font-medium mb-4">Global Feature Importance</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={importance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="feature" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
              <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <h2 className="text-lg font-medium mb-4">Cohort Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={averages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
              <Legend />
              <Line type="monotone" dataKey="hba1c" stroke="#10B981" strokeWidth={2} dot={false} name="HbA1c" />
              <Line type="monotone" dataKey="bmi" stroke="#9CA3AF" strokeWidth={2} dot={false} name="BMI" />
              <Line type="monotone" dataKey="adherence" stroke="#F59E0B" strokeWidth={2} dot={false} name="Adherence" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
