import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ClientForm } from "@/components/forms/client-form"
import { clientApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditClient() {
  const { id } = useParams()
  const [client, setClient] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        const response = await clientApi.getById(Number(id))
        setClient(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching client:", error)
        toast({
          title: "Error",
          description: "Failed to fetch client details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading client details...</span>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Client not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Client</h1>
      <ClientForm client={client} isEditing={true} />
    </div>
  )
}
