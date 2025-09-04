export type Gender = "Male" | "Female" | "Other"
export type Condition = "Diabetes" | "Heart Failure" | "CKD"

export type PatientInput = {
  patient_id: string
  age: number
  gender: Gender
  condition: Condition
  bp_sys: number
  bp_dia: number
  hr: number
  bmi: number
  spO2: number
  hba1c: number
  cholesterol: number
  creatinine: number
  med_adherence_percent: number
  last_visit_date?: string
}

export type Patient = {
  id: string
  age: number
  gender: Gender
  condition: Condition
  bp_sys: number
  bp_dia: number
  hr: number
  bmi: number
  spO2: number
  hba1c: number
  cholesterol: number
  creatinine: number
  med_adherence_percent: number
  last_update: string
  riskScore: number
  riskLevel: "Low" | "Medium" | "High"
  drivers?: string[]
  medications?: string
}
