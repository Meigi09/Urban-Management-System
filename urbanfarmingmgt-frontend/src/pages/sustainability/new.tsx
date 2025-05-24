"use client"

import { SustainabilityForm } from "@/components/forms/sustainability-form"

export default function NewSustainabilityMetric() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Sustainability Metric</h1>
      <SustainabilityForm />
    </div>
  )
}
