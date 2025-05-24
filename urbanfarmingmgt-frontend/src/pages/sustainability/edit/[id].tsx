import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SustainabilityForm } from "@/components/forms/sustainability-form"
import { sustainabilityApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditSustainabilityMetric() {
  const { id } = useParams()
  const [metric, setMetric] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        setIsLoading(true)
        const response = await sustainabilityApi.getById(Number(id))
        setMetric(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching sustainability metric:", error)
        toast({
          title: "Error",
          description: "Failed to fetch sustainability metric details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchMetric()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading sustainability metric details...</span>
      </div>
    )
  }

  if (!metric) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Sustainability metric not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Sustainability Metric</h1>
      <SustainabilityForm metric={metric} isEditing={true} />
    </div>
  )
}
