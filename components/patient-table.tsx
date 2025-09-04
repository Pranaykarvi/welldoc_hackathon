"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RiskBadge } from "./risk-badge"
import type { Patient } from "@/lib/data"

type Column = "patient_id" | "risk_score" | "condition" | "last_update"

export function PatientTable({ patients }: { patients: Patient[] }) {
  const [sortBy, setSortBy] = useState<Column>("risk_score")
  const [asc, setAsc] = useState(false)

  const sorted = useMemo(() => {
    const arr = [...patients]
    arr.sort((a, b) => {
      const dir = asc ? 1 : -1
      if (sortBy === "risk_score") return (a.risk_score - b.risk_score) * dir
      if (sortBy === "patient_id") return a.patient_id.localeCompare(b.patient_id) * dir
      if (sortBy === "condition") return a.condition.localeCompare(b.condition) * dir
      return (new Date(a.last_update).getTime() - new Date(b.last_update).getTime()) * dir
    })
    return arr
  }, [patients, sortBy, asc])

  function toggle(col: Column) {
    if (col === sortBy) {
      setAsc(!asc)
    } else {
      setSortBy(col)
      setAsc(true)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="py-2">
              <Button
                onClick={() => toggle("patient_id")}
                variant="ghost"
                className="h-8 text-gray-300 hover:text-white"
              >
                Patient ID <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </th>
            <th className="py-2">
              <Button
                onClick={() => toggle("risk_score")}
                variant="ghost"
                className="h-8 text-gray-300 hover:text-white"
              >
                Risk Score <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </th>
            <th className="py-2">
              <Button
                onClick={() => toggle("condition")}
                variant="ghost"
                className="h-8 text-gray-300 hover:text-white"
              >
                Condition <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </th>
            <th className="py-2">Alerts</th>
            <th className="py-2">
              <Button
                onClick={() => toggle("last_update")}
                variant="ghost"
                className="h-8 text-gray-300 hover:text-white"
              >
                Last Update <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.patient_id} className="border-t border-gray-800">
              <td className="py-3">
                <Link href={`/patient/${p.patient_id}`} className="text-emerald-400 hover:text-emerald-300">
                  {p.patient_id}
                </Link>
              </td>
              <td className="py-3">
                <RiskBadge score={p.risk_score} level={p.risk_level} />
              </td>
              <td className="py-3 capitalize">{p.condition}</td>
              <td className="py-3">
                <div className="flex flex-wrap gap-2">
                  {p.alerts?.map((a) => (
                    <span key={a} className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
                      {a}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 text-gray-300">{new Date(p.last_update).toLocaleDateString()}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                No patients match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
