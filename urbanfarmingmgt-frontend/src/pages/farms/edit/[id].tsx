import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FarmForm } from "@/components/forms/farm-form"
import { farmApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditFarm() {
  const { id } = useParams()
  const [farm, setFarm] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setIsLoading(true)
        const response = await farmApi.getById(Number(id))
        setFarm(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching farm:", error)
        toast({
          title: "Error",
          description: "Failed to fetch farm details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchFarm()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading farm details...</span>
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Farm not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Farm</h1>
      <FarmForm farm={farm} isEditing={true} />
    </div>
  )
}
