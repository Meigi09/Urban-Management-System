"use client"

import { OrderForm } from "@/components/forms/order-form"

export default function NewOrder() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Order</h1>
      <OrderForm />
    </div>
  )
}
