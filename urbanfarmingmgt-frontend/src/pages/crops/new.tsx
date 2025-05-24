"use client"

import { CropForm } from "@/components/forms/crop-form"

export default function NewCrop() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Crop</h1>
      <CropForm />
    </div>
  )
}
