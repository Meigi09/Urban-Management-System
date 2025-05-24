"use client"

import { HarvestForm } from "@/components/forms/harvest-form"

export default function NewHarvest() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Record New Harvest</h1>
      <HarvestForm />
    </div>
  )
}
