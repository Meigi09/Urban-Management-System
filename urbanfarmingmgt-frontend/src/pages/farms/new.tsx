"use client"

import { FarmForm } from "@/components/forms/farm-form"

export default function NewFarm() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Farm</h1>
      <FarmForm />
    </div>
  )
}
