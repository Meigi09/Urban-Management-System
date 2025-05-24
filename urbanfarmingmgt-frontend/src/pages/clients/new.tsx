"use client"

import { ClientForm } from "@/components/forms/client-form"

export default function NewClient() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Client</h1>
      <ClientForm />
    </div>
  )
}
