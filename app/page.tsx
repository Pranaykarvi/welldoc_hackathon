import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-emerald-500" aria-hidden />
          <span className="text-xl font-semibold text-balance">Cohort Compass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="secondary" className="bg-gray-800 text-gray-100 hover:bg-gray-700">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-5xl font-semibold text-balance leading-tight">
          AI‑Driven Risk Prediction for Chronic Care, in one dashboard
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl leading-relaxed">
          Help clinicians proactively manage diabetes, heart failure, and more. Predict 90‑day deterioration risk with
          explainability, visualize trends, and act quickly—securely and simply.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6">Create account</Button>
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            View demo dashboard →
          </Link>
        </div>

        <div className="mt-12 rounded-2xl bg-gray-900 p-4 shadow-md">
          <img src="/digital-doctor-healthcare-science-medical-600nw-2267168307.png" alt="Cohort Compass dashboard preview" className="rounded-xl w-full" />
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-12 text-sm text-gray-400">
        © {new Date().getFullYear()} Cohort Compass. All rights reserved.
      </footer>
    </main>
  )
}
