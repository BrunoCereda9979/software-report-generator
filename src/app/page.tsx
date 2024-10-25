"use client"

import Dashboard from "@/components/Dashboard"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Toaster />
      <Dashboard />
    </main>
  )
  
}