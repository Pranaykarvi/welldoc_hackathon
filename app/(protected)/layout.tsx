import type { ReactNode } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
