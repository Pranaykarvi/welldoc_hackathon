"use client"

import { UploadCsv } from "@/components/upload-csv"

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Upload Patients (CSV)</h1>
      <UploadCsv />
    </div>
  )
}
