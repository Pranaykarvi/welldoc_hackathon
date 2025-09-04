import type { PatientInput } from "@/types/patient"

export function computeRisk(p: PatientInput) {
  // Normalize features to 0..1 ranges (rough demo)
  const systolic = clamp((p.bp_sys - 110) / 50) // 110-160
  const diastolic = clamp((p.bp_dia - 70) / 40) // 70-110
  const hr = clamp((p.hr - 60) / 60) // 60-120
  const bmi = clamp((p.bmi - 22) / 18) // 22-40
  const spo2 = clamp((98 - p.spO2) / 10) // worse when lower
  const hba1c = clamp((p.hba1c - 5.5) / 3) // 5.5-8.5
  const chol = clamp((p.cholesterol - 150) / 100) // 150-250
  const creat = clamp((p.creatinine - 0.8) / 1.2) // 0.8-2.0
  const adher = clamp((100 - p.med_adherence_percent) / 100) // worse when lower

  // weights sum roughly to 1
  const score01 =
    0.18 * hba1c +
    0.14 * adher +
    0.12 * bmi +
    0.12 * spo2 +
    0.12 * systolic +
    0.08 * diastolic +
    0.12 * chol +
    0.07 * hr +
    0.05 * creat

  const riskScore = Math.round(score01 * 100)
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low"

  const drivers: string[] = []
  if (hba1c > 0.4) drivers.push(`HbA1c elevated at ${p.hba1c.toFixed(1)}`)
  if (p.med_adherence_percent < 70) drivers.push(`Adherence low at ${p.med_adherence_percent}%`)
  if (p.spO2 < 94) drivers.push(`SpO2 reduced at ${p.spO2}%`)
  if (p.bp_sys > 140) drivers.push(`Systolic BP high at ${p.bp_sys}`)
  if (p.bmi > 32) drivers.push(`BMI high at ${p.bmi.toFixed(1)}`)
  if (p.cholesterol > 220) drivers.push(`Cholesterol high at ${p.cholesterol}`)
  if (drivers.length === 0) drivers.push("No strong risk drivers detected")

  return { riskScore, riskLevel, drivers }
}

function clamp(x: number) {
  return Math.max(0, Math.min(1, x))
}
