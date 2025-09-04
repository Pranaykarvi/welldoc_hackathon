"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-950">
      <div className="p-4 rounded-2xl bg-gray-900 shadow-md">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white",
              card: "bg-gray-900 text-gray-100",
              headerTitle: "text-gray-100",
              headerSubtitle: "text-gray-300",
              formFieldInput: "bg-gray-800 text-gray-100",
            },
          }}
        />
      </div>
    </main>
  )
}
