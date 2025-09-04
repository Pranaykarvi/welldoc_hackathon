"use client"

import type React from "react"

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import type { Patient } from "@/lib/data"

export function TrendCharts({ patient }: { patient: Patient }) {
  const data = patient.trends
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ChartBox title="Vitals: BP (sys), HR, SpO2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
            <Legend />
            <Line type="monotone" dataKey="bp_sys" name="BP sys" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hr" name="HR" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="spO2" name="SpO2" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Labs: HbA1c, Cholesterol, Creatinine">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
            <Legend />
            <Line type="monotone" dataKey="hba1c" name="HbA1c" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="cholesterol" name="Chol" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="creatinine" name="Creat" stroke="#9CA3AF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Medication adherence %">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#E5E7EB" }} />
            <Line
              type="monotone"
              dataKey="med_adherence_percent"
              name="Adherence"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  )
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-gray-900 p-4 shadow-md h-72">
      <h3 className="text-sm text-gray-300 mb-2">{title}</h3>
      {children}
    </div>
  )
}
