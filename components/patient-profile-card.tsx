import { Card, CardContent } from "@/components/ui/card"
import type { Patient } from "@/lib/data"

export function PatientProfileCard({ patient }: { patient: Patient }) {
  return (
    <Card className="bg-gray-900 border-0 rounded-2xl shadow-md">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <div className="text-sm text-gray-400">Patient ID</div>
            <div className="text-lg font-medium">{patient.patient_id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Age / Gender</div>
            <div className="text-lg font-medium">
              {patient.age} / {patient.gender}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Condition(s)</div>
            <div className="text-lg font-medium capitalize">{patient.condition}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Med adherence</div>
            <div className="text-lg font-medium">{patient.med_adherence_percent}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
