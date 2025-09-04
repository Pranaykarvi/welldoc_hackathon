"use client"

import { useMemo, useState } from "react"
import { SummaryCards } from "@/components/summary-cards"
import { PatientTable } from "@/components/patient-table"
import { RiskBarChart } from "@/components/risk-bar-chart"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePatientStore } from "@/lib/store"
import { seedPatients } from "@/lib/data"

export default function DashboardPage() {
  const { patients, ensureSeed } = usePatientStore()
  // Seed on first load for demo
  ensureSeed(seedPatients)

  const [query, setQuery] = useState("")
  const [condition, setCondition] = useState("all_conditions")
  const [riskLevel, setRiskLevel] = useState("all_risk_levels")

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesId = p.patient_id.toLowerCase().includes(query.toLowerCase())
      const matchesCond = condition === "all_conditions" ? true : p.condition.toLowerCase() === condition.toLowerCase()
      const matchesRisk = riskLevel === "all_risk_levels" ? true : p.risk_level === riskLevel
      return matchesId && matchesCond && matchesRisk
    })
  }, [patients, query, condition, riskLevel])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Dashboard</h1>
      </div>

      <SummaryCards patients={filtered} />

      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Search by Patient ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-800 border-0 text-gray-100 placeholder:text-gray-400"
          />
          <Select onValueChange={(v) => setCondition(v)} value={condition}>
            <SelectTrigger className="bg-gray-800 border-0 text-gray-100">
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-100">
              <SelectItem value="all_conditions">All conditions</SelectItem>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="heart_failure">Heart Failure</SelectItem>
              <SelectItem value="ckd">CKD</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setRiskLevel(v)} value={riskLevel}>
            <SelectTrigger className="bg-gray-800 border-0 text-gray-100">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-100">
              <SelectItem value="all_risk_levels">All risk levels</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          <PatientTable patients={filtered} />
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <h2 className="text-lg font-medium mb-4">Risk distribution</h2>
        <RiskBarChart patients={filtered} />
      </div>
    </div>
  )
}
