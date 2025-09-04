"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Patient } from "./data"

type PatientState = {
  patients: Patient[]
  ensureSeed: (seed: Patient[]) => void
  addOrUpdate: (p: Patient) => void
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      ensureSeed: (seed) => {
        const st = get()
        if (!st.patients || st.patients.length === 0) {
          set({ patients: seed })
        }
      },
      addOrUpdate: (p) => {
        set((state) => {
          const idx = state.patients.findIndex((x) => x.patient_id === p.patient_id)
          if (idx >= 0) {
            const next = [...state.patients]
            next[idx] = p
            return { patients: next }
          }
          return { patients: [p, ...state.patients] }
        })
      },
    }),
    { name: "cohort-compass-store" },
  ),
)
