"use client"

import type React from "react"
import { useCallback, useState } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { usePatientStore } from "@/lib/store"
import { type CsvRow, toPatientFromPrediction } from "@/lib/data"

// Type for the PapaParse result
interface PapaParseResult {
  data: CsvRow[]; // Define the structure of the parsed data here
  errors: any[]; // Optionally define error structure if needed
  meta: any; // The metadata (headers, etc.) returned by the parse
}

export function UploadCsv() {
  const [rows, setRows] = useState<CsvRow[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { addOrUpdate } = usePatientStore()

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  function handleFile(file: File) {
    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: PapaParseResult) => { // Now properly typing the result
        const data = result.data.map(cleanRow).filter(Boolean) as CsvRow[] // Clean and type the data
        setRows(data)
      },
      error: (err: any) => { // Typing error as any
        console.error("[v0] CSV parse error:", err.message)
      },
    })
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  function cleanRow(raw: any): CsvRow | null {
    const required = [
      "patient_id",
      "age",
      "gender",
      "condition",
      "bp_sys",
      "bp_dia",
      "hr",
      "bmi",
      "spO2",
      "hba1c",
      "cholesterol",
      "creatinine",
      "med_adherence_percent",
      "last_visit_date",
    ]
    for (const k of required) {
      if (raw[k] === undefined || raw[k] === "") return null
    }
    return {
      patient_id: String(raw.patient_id),
      age: Number(raw.age),
      gender: String(raw.gender),
      condition: String(raw.condition),
      bp_sys: Number(raw.bp_sys),
      bp_dia: Number(raw.bp_dia),
      hr: Number(raw.hr),
      bmi: Number(raw.bmi),
      spO2: Number(raw.spO2),
      hba1c: Number(raw.hba1c),
      cholesterol: Number(raw.cholesterol),
      creatinine: Number(raw.creatinine),
      med_adherence_percent: Number(raw.med_adherence_percent),
      last_visit_date: String(raw.last_visit_date),
    }
  }

  const hasRows = rows.length > 0

  async function runPrediction() {
    try {
      setLoading(true)
      for (const r of rows) {
        const res = await fetch("/api/predict", { method: "POST", body: JSON.stringify(r) })
        const out = await res.json()
        if (res.ok) {
          const patient = toPatientFromPrediction(r, out)
          addOrUpdate(patient)
        } else {
          console.error("[v0] Prediction error:", out?.error)
        }
      }
      alert("Predictions complete. Patients added to the dashboard.")
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
      </div>

      {hasRows && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Preview</h2>
          <div className="max-h-80 overflow-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-300 sticky top-0">
                <tr>
                  {Object.keys(rows[0]!).map((k) => (
                    <th key={k} className="px-3 py-2 text-left">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, idx) => (
                  <tr key={idx} className="border-t border-gray-800">
                    {Object.values(r).map((v, i) => (
                      <td key={i} className="px-3 py-2 text-gray-300">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={runPrediction} disabled={loading} className="mt-4 bg-emerald-600 hover:bg-emerald-500">
            {loading ? "Running..." : "Run Prediction"}
          </Button>
        </div>
      )}
    </div>
  )
}
