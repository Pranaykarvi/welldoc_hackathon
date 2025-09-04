"use client"

import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import { usePatientStore } from "@/lib/store"
import { PatientProfileCard } from "@/components/patient-profile-card"
import { TrendCharts } from "@/components/trend-charts"
import { RiskGauge } from "@/components/risk-gauge"
import { Explainability } from "@/components/explainability"

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { patients } = usePatientStore()
  const patient = patients.find((p) => p.patient_id === id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Patient {patient!.patient_id}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <PatientProfileCard patient={patient!} />
          <div className="mt-6 rounded-2xl bg-gray-900 p-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Trends (last 90 days)</h2>
            <TrendCharts patient={patient!} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Risk Prediction</h2>
            <RiskGauge score={patient!.risk_score} level={patient!.risk_level} confidence={patient!.confidence} />
          </div>
          <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Explainability</h2>
            <Explainability drivers={patient!.drivers} />
          </div>
          <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Recommended Actions</h2>
            <ul className="list-disc pl-5 text-gray-300 leading-relaxed">
              <li>Schedule follow-up in 7 days</li>
              <li>Flag to care manager for adherence counseling</li>
              <li>Review labs: HbA1c and creatinine</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
