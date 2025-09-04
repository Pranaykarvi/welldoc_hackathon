export type TrendPoint = {
  date: string
  bp_sys: number
  hr: number
  spO2: number
  hba1c: number
  cholesterol: number
  creatinine: number
  med_adherence_percent: number
}

export type Patient = {
  patient_id: string
  age: number
  gender: string
  condition: string
  risk_score: number
  risk_level: "Low" | "Medium" | "High"
  confidence: "Low" | "Medium" | "High"
  last_update: string
  alerts?: string[]
  med_adherence_percent: number
  trends: TrendPoint[]
  drivers: string[]
}

export type CsvRow = {
  patient_id: string
  age: number
  gender: string
  condition: string
  bp_sys: number
  bp_dia: number
  hr: number
  bmi: number
  spO2: number
  hba1c: number
  cholesterol: number
  creatinine: number
  med_adherence_percent: number
  last_visit_date: string
}

export function toPatientFromPrediction(row: CsvRow, pred: any): Patient {
  const trends: TrendPoint[] = Array.from({ length: 12 }).map((_, i) => ({
    date: `W-${11 - i}`,
    bp_sys: Math.round(row.bp_sys + (Math.random() * 6 - 3)),
    hr: Math.round(row.hr + (Math.random() * 6 - 3)),
    spO2: Math.round(row.spO2 + (Math.random() * 2 - 1)),
    hba1c: Number((row.hba1c + (Math.random() * 0.2 - 0.1)).toFixed(1)),
    cholesterol: Math.round(row.cholesterol + (Math.random() * 10 - 5)),
    creatinine: Number((row.creatinine + (Math.random() * 0.06 - 0.03)).toFixed(2)),
    med_adherence_percent: Math.max(40, Math.min(100, Math.round(row.med_adherence_percent + (Math.random() * 6 - 3)))),
  }))

  return {
    patient_id: row.patient_id,
    age: row.age,
    gender: row.gender,
    condition: row.condition,
    risk_score: pred.risk_score,
    risk_level: pred.risk_level,
    confidence: pred.confidence,
    last_update: pred.last_update,
    alerts: deriveAlerts(row),
    med_adherence_percent: row.med_adherence_percent,
    trends,
    drivers: pred.drivers ?? [],
  }
}

function deriveAlerts(row: CsvRow): string[] {
  const alerts: string[] = []
  if (row.hba1c > 8) alerts.push("Rising HbA1c")
  if (row.bp_sys > 140) alerts.push("Elevated BP")
  if (row.med_adherence_percent < 70) alerts.push("Low adherence")
  return alerts
}

export const seedPatients: Patient[] = [
  {
    patient_id: "P-1001",
    age: 64,
    gender: "F",
    condition: "diabetes",
    risk_score: 72,
    risk_level: "High",
    confidence: "High",
    last_update: new Date().toISOString(),
    alerts: ["Rising HbA1c", "Low adherence"],
    med_adherence_percent: 62,
    drivers: ["HbA1c ↑ 8.1 → 9.3", "Adherence ↓ to 60%", "BP elevated 146/92"],
    trends: Array.from({ length: 12 }).map((_, i) => ({
      date: `W-${11 - i}`,
      bp_sys: 145 + (i % 3),
      hr: 86 + (i % 2),
      spO2: 94 - (i % 2),
      hba1c: 8.1 + i * 0.1,
      cholesterol: 210 + (i % 5),
      creatinine: 1.2 + (i % 3) * 0.02,
      med_adherence_percent: 70 - i,
    })),
  },
  {
    patient_id: "P-1002",
    age: 57,
    gender: "M",
    condition: "heart failure",
    risk_score: 45,
    risk_level: "Medium",
    confidence: "Medium",
    last_update: new Date().toISOString(),
    alerts: ["Elevated BP"],
    med_adherence_percent: 78,
    drivers: ["BP elevated 142/88", "Cholesterol ↑ 215"],
    trends: Array.from({ length: 12 }).map((_, i) => ({
      date: `W-${11 - i}`,
      bp_sys: 140 + (i % 2),
      hr: 88 - (i % 2),
      spO2: 95 - (i % 2),
      hba1c: 7.5,
      cholesterol: 205 + (i % 4),
      creatinine: 1.0,
      med_adherence_percent: 80 - (i % 3),
    })),
  },
  {
    patient_id: "P-1003",
    age: 49,
    gender: "F",
    condition: "ckd",
    risk_score: 22,
    risk_level: "Low",
    confidence: "Low",
    last_update: new Date().toISOString(),
    alerts: [],
    med_adherence_percent: 92,
    drivers: ["Stable labs"],
    trends: Array.from({ length: 12 }).map((_, i) => ({
      date: `W-${11 - i}`,
      bp_sys: 120 + (i % 2),
      hr: 72,
      spO2: 98,
      hba1c: 6.5,
      cholesterol: 180,
      creatinine: 1.1,
      med_adherence_percent: 93 - (i % 2),
    })),
  },
]
