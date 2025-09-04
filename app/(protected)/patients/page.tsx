"use client"

import { PatientTable } from "@/components/patient-table"
import { usePatientStore } from "@/lib/store"
import { seedPatients } from "@/lib/data"

export default function PatientsPage() {
  const { patients, ensureSeed } = usePatientStore()
  ensureSeed(seedPatients)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-balance">Patients</h1>
      <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
        <PatientTable patients={patients} />
      </div>
    </div>
  )
}
