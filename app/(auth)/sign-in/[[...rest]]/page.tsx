"use client"

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-950">
      <div className="p-4 rounded-2xl bg-gray-900 shadow-md">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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
