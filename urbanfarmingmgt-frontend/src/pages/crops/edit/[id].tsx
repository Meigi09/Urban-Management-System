import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { CropForm } from "@/components/forms/crop-form"
import { cropApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditCrop() {
  const { id } = useParams()
  const [crop, setCrop] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setIsLoading(true)
        const response = await cropApi.getById(Number(id))
        setCrop(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching crop:", error)
        toast({
          title: "Error",
          description: "Failed to fetch crop details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchCrop()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading crop details...</span>
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Crop not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Crop</h1>
      <CropForm crop={crop} isEditing={true} />
    </div>
  )
}
