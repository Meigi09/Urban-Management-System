import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { orderApi, clientApi, inventoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const orderSchema = z.object({
  clientId: z.string().min(1, { message: "Client is required" }),
  inventoryId: z.string().min(1, { message: "Inventory item is required" }),
  quantityOrdered: z.string().min(1, { message: "Quantity is required" }),
  deliveryDate: z.string().min(1, { message: "Delivery date is required" }),
  deliveryStatus: z.string().min(1, { message: "Delivery status is required" }),
  notes: z.string().optional(),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
  order?: any
  isEditing?: boolean
}

export function OrderForm({ order, isEditing = false }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [inventories, setInventories] = useState<any[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, inventoriesResponse] = await Promise.all([clientApi.getAll(), inventoryApi.getAll()])
        setClients(clientsResponse.data)
        setInventories(inventoriesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const defaultValues: Partial<OrderFormValues> = {
    clientId: order?.clientId ? String(order.clientId) : "",
    inventoryId: order?.inventoryId ? String(order.inventoryId) : "",
    quantityOrdered: order?.quantityOrdered ? String(order.quantityOrdered) : "",
    deliveryDate: order?.deliveryDate ? new Date(order.deliveryDate).toISOString().split("T")[0] : "",
    deliveryStatus: order?.deliveryStatus || "PENDING",
    notes: order?.notes || "",
  }

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  })

  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true)
    try {
      const orderData = {
        clientId: Number.parseInt(data.clientId),
        inventoryId: Number.parseInt(data.inventoryId),
        quantityOrdered: Number.parseFloat(data.quantityOrdered),
        deliveryDate: new Date(data.deliveryDate).toISOString(),
        deliveryStatus: data.deliveryStatus,
        notes: data.notes,
      }

      // Check inventory availability
      const availabilityResponse = await inventoryApi.checkAvailability(
        orderData.inventoryId,
        orderData.quantityOrdered,
      )

      if (!availabilityResponse.data) {
        toast({
          title: "Insufficient inventory",
          description: "Not enough quantity available in inventory",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (isEditing && order?.id) {
        await orderApi.update(order.id, orderData)

        // Update order status if changed
        if (orderData.deliveryStatus !== order.deliveryStatus) {
          await orderApi.updateStatus(order.id, orderData.deliveryStatus)
        }

        toast({
          title: "Order updated",
          description: "Order has been updated successfully",
        })
      } else {
        // Create order
        const response = await orderApi.create(orderData)

        // Place the order (which will update inventory)
        if (response.data && response.data.id) {
          await orderApi.placeOrder(response.data.id)

          // Update inventory quantity
          await inventoryApi.updateQuantityAfterOrder(orderData.inventoryId, orderData.quantityOrdered)
        }

        toast({
          title: "Order created",
          description: "Order has been created successfully",
        })
      }
      navigate("/orders")
    } catch (error) {
      console.error("Error saving order:", error)
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Order" : "Create New Order"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inventoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an inventory item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventories.map((inventory) => (
                        <SelectItem key={inventory.id} value={String(inventory.id)}>
                          {inventory.produceType} ({inventory.quantity} {inventory.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityOrdered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Ordered</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Quantity ordered" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/orders")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Order" : "Create Order"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
