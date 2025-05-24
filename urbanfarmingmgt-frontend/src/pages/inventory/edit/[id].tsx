import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { InventoryForm } from "@/components/forms/inventory-form"
import { inventoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditInventory() {
  const { id } = useParams()
  const [inventory, setInventory] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const response = await inventoryApi.getById(Number(id))
        setInventory(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching inventory:", error)
        toast({
          title: "Error",
          description: "Failed to fetch inventory details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading inventory details...</span>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Inventory item not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Inventory Item</h1>
      <InventoryForm inventory={inventory} isEditing={true} />
    </div>
  )
}
