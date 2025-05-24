import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { HarvestForm } from "@/components/forms/harvest-form"
import { harvestApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditHarvest() {
  const { id } = useParams()
  const [harvest, setHarvest] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHarvest = async () => {
      try {
        setIsLoading(true)
        const response = await harvestApi.getById(Number(id))
        setHarvest(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching harvest:", error)
        toast({
          title: "Error",
          description: "Failed to fetch harvest details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHarvest()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading harvest details...</span>
      </div>
    )
  }

  if (!harvest) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Harvest not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Harvest</h1>
      <HarvestForm harvest={harvest} isEditing={true} />
    </div>
  )
}
