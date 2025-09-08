"use client"

import type React from "react"
import { useCallback, useState } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { usePatientStore } from "@/lib/store"
import { type CsvRow, toPatientFromPrediction } from "@/lib/data"

interface PapaParseResult {
  data: any[]
  errors: any[]
  meta: any
}

export function UploadCsv() {
  const [rows, setRows] = useState<CsvRow[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const { addOrUpdate } = usePatientStore()

  const requiredColumns = [
    "gender",
    "age",
    "hypertension",
    "heart_disease",
    "smoking_history",
    "bmi",
    "HbA1c_level",
    "blood_glucose_level",
    "diabetes",
  ]

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  }, [])

  function handleFile(file: File) {
    setFileName(file.name)
    setSummary(null)
    setWarnings([])

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: PapaParseResult) => {
        const missingCols = requiredColumns.filter(col => !Object.keys(result.data[0] || {}).includes(col))
        if (missingCols.length > 0) {
          setWarnings([`Missing required columns: ${missingCols.join(", ")}`])
        }

        const validRows = result.data.map(cleanRow).filter(Boolean) as CsvRow[]
        setRows(validRows)

        if (validRows.length === 0 && missingCols.length === 0) {
          setWarnings(["No valid rows found in CSV."])
        }

        console.log("Parsed rows:", validRows.length)
      },
      error: (err: any) => console.error("[CSV parse error]:", err.message),
    })
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  function cleanRow(raw: any): CsvRow | null {
    try {
      // Generate patient_id if missing
      const patientId = raw.patient_id || raw.id || `patient_${Math.random().toString(36).substring(2, 8)}`
      const condition =
        raw.hypertension ||
        raw.heart_disease ||
        raw.smoking_history ||
        raw.diabetes ||
        "unknown"

      return {
        patient_id: String(patientId),
        age: Number(raw.age || 0),
        gender: String(raw.gender || "unknown"),
        condition: String(condition),
        bp_sys: Number(raw.bp_sys || 0),
        bp_dia: Number(raw.bp_dia || 0),
        hr: Number(raw.hr || 0),
        bmi: Number(raw.bmi || 0),
        spO2: Number(raw.spO2 || 0),
        hba1c: Number(raw.HbA1c_level || 0),
        cholesterol: Number(raw.cholesterol || 0),
        creatinine: Number(raw.creatinine || 0),
        med_adherence_percent: Number(raw.med_adherence_percent || 100),
        last_visit_date: raw.last_visit_date || new Date().toISOString(),
      }
    } catch (err) {
      console.error("Error cleaning row:", err, raw)
      return null
    }
  }

  async function runPrediction() {
    if (!fileName) return alert("Please select a CSV file first.")
    if (rows.length === 0) return alert("No valid rows to predict. Check warnings.")

    setLoading(true)
    try {
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
      if (!fileInput?.files?.[0]) return alert("No file found")

      const formData = new FormData()
      formData.append("file", fileInput.files[0])

      const res = await fetch("http://127.0.0.1:8000/api/predictions/predict-csv", {
        method: "POST",
        body: formData,
      })

      const out = await res.json()
      if (!res.ok) {
        console.error("[Prediction error]:", out?.detail || out)
        return alert("Prediction failed. Check console.")
      }

      console.log("Backend output:", out)

      out.time_series_predictions.forEach((pred: any) => {
        const r = rows[pred.row_index]
        if (r) addOrUpdate(toPatientFromPrediction(r, pred))
      })

      setSummary(out.summary.final_judgement)

    } catch (err) {
      console.error("[Prediction fetch error]:", err)
      alert("Error connecting to backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gray-900 p-4 shadow-md">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="rounded-xl border border-dashed border-gray-700 p-8 text-center bg-gray-950"
      >
        <p className="text-gray-300">Drag & drop CSV here, or click to select</p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={onSelectFile}
          className="mt-4 block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-gray-100 hover:file:bg-gray-700"
        />
        {fileName && <p className="mt-2 text-xs text-gray-400">Selected: {fileName}</p>}
        {warnings.length > 0 && (
          <div className="mt-2 text-yellow-400 text-sm">
            {warnings.map((w, i) => <p key={i}>{w}</p>)}
          </div>
        )}
      </div>

      <div className="mt-6">
        {rows.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-3">Preview</h2>
            <div className="max-h-80 overflow-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300 sticky top-0">
                  <tr>
                    {Object.keys(rows[0]).map((k) => (
                      <th key={k} className="px-3 py-2 text-left">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((r, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      {Object.values(r).map((v, i) => (
                        <td key={i} className="px-3 py-2 text-gray-300">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Button
          onClick={runPrediction}
          disabled={loading}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500"
        >
          {loading ? "Running..." : "Run Prediction"}
        </Button>

        {summary && (
          <div className="mt-4 p-4 bg-gray-800 text-green-400 rounded">
            <h3 className="font-semibold text-lg">Final Judgement</h3>
            <p className="mt-1">{summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
