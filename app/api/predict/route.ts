import { type NextRequest, NextResponse } from "next/server"

type Row = {
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

function computeRisk(row: Row) {
  let score = 0
  const drivers: string[] = []

  if (row.hba1c >= 8) {
    score += Math.min((row.hba1c - 7) * 8, 25)
    drivers.push(`HbA1c ↑ ${row.hba1c.toFixed(1)}`)
  }
  if (row.bp_sys >= 140 || row.bp_dia >= 90) {
    score += 15
    drivers.push(`BP elevated ${row.bp_sys}/${row.bp_dia}`)
  }
  if (row.spO2 < 94) {
    score += 12
    drivers.push(`SpO2 low ${row.spO2}%`)
  }
  if (row.med_adherence_percent < 75) {
    score += Math.min((75 - row.med_adherence_percent) * 0.6, 18)
    drivers.push(`Adherence ↓ to ${row.med_adherence_percent}%`)
  }
  if (row.creatinine > 1.3) {
    score += 10
    drivers.push(`Creatinine ↑ ${row.creatinine}`)
  }
  if (row.cholesterol > 200) {
    score += 8
    drivers.push(`Cholesterol ↑ ${row.cholesterol}`)
  }
  if (row.bmi >= 30) {
    score += 6
    drivers.push(`BMI ↑ ${row.bmi}`)
  }
  if (row.hr > 100) {
    score += 4
    drivers.push(`HR ↑ ${row.hr}`)
  }

  score = Math.min(100, Math.round(score))
  const level = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low"
  const confidence = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low"

  return { score, level, confidence, drivers: drivers.slice(0, 5) }
}

export async function POST(req: NextRequest) {
  try {
    const row = (await req.json()) as Row
    const r = computeRisk(row)
    return NextResponse.json({
      patient_id: row.patient_id,
      risk_score: r.score,
      risk_level: r.level,
      confidence: r.confidence,
      drivers: r.drivers,
      last_update: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 })
  }
}
