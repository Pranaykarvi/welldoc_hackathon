"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Patient } from "@/types/patient"
import { samplePatients } from "@/lib/sample-data"

type Ctx = {
  patients: Patient[]
  addOrUpdatePatient: (p: Patient) => void
  getPatientById: (id: string) => Patient | undefined
}

const PatientContext = createContext<Ctx | null>(null)

const STORAGE_KEY = "cohort-compass.patients.v1"

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])

  // load from localStorage or seed with samplePatients
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setPatients(JSON.parse(raw))
      } else {
        setPatients(samplePatients)
      }
    } catch {
      setPatients(samplePatients)
    }
  }, [])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
    } catch {}
  }, [patients])

  const addOrUpdatePatient = (p: Patient) => {
    setPatients((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = p
        return next
      }
      return [p, ...prev]
    })
  }

  const getPatientById = (id: string) => patients.find((p) => p.id === id)

  const value = useMemo(() => ({ patients, addOrUpdatePatient, getPatientById }), [patients])

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
}

export function usePatients() {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error("usePatients must be used within PatientProvider")
  return ctx
}
