"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/upload", label: "Upload" },
  { href: "/analytics", label: "Analytics" },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-emerald-500" aria-hidden />
          <span className="font-medium">Cohort Compass</span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("text-sm text-gray-300 hover:text-white", pathname === l.href && "text-white")}
            >
              {l.label}
            </Link>
          ))}
          <UserButton appearance={{ elements: { userButtonPopoverCard: "bg-gray-900 text-gray-100" } }} />
        </div>
      </div>
    </nav>
  )
}
