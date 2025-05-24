import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { StaffForm } from "@/components/forms/staff-form"
import { staffApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditStaff() {
  const { id } = useParams()
  const [staff, setStaff] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true)
        const response = await staffApi.getById(Number(id))
        setStaff(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching staff:", error)
        toast({
          title: "Error",
          description: "Failed to fetch staff details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchStaff()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading staff details...</span>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Staff member not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Staff Member</h1>
      <StaffForm staff={staff} isEditing={true} />
    </div>
  )
}
