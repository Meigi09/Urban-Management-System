"use client"

import { StaffForm } from "@/components/forms/staff-form"

export default function NewStaff() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Staff Member</h1>
      <StaffForm />
    </div>
  )
}
