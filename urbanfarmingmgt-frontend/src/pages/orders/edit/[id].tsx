import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { OrderForm } from "@/components/forms/order-form"
import { orderApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditOrder() {
  const { id } = useParams()
  const [order, setOrder] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await orderApi.getById(Number(id))
        setOrder(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Order</h1>
      <OrderForm order={order} isEditing={true} />
    </div>
  )
}
