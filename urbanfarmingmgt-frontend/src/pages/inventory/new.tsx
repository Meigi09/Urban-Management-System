"use client"

import { InventoryForm } from "@/components/forms/inventory-form"

export default function NewInventory() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Inventory Item</h1>
      <InventoryForm />
    </div>
  )
}
