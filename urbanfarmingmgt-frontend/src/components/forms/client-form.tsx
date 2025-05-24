"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { clientApi, orderApi } from "@/services/api-integration"
import type { Client, ClientFormData, Order } from "@/types/models"

const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contactInfo: z.string().min(5, { message: "Contact info must be at least 5 characters" }),
  orderPreferences: z.string().min(1, { message: "Order preferences are required" }),
  paymentHistory: z.string().min(1, { message: "Payment history is required" }),
  orderID: z.number().min(1, { message: "Order is required" }),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: Client
  isEditing?: boolean
}

export function ClientForm({ client, isEditing = false }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<ClientFormValues> = {
    name: client?.name || "",
    contactInfo: client?.contactInfo || "",
    orderPreferences: client?.orderPreferences || "",
    paymentHistory: client?.paymentHistory || "",
    orderID: client?.order?.orderID || 0,
  }

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderApi.getAll()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Warning",
          description: "Could not load orders. You may need to create an order first.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [])

  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true)
    try {
      const clientData: ClientFormData = {
        name: data.name,
        contactInfo: data.contactInfo,
        orderPreferences: data.orderPreferences,
        paymentHistory: data.paymentHistory,
        orderID: data.orderID,
      }

      if (isEditing && client?.clientID) {
        const response = await clientApi.update(client.clientID, clientData)
        toast({
          title: "Client updated",
          description: response || "Client has been updated successfully",
        })
      } else {
        const response = await clientApi.create(clientData)
        toast({
          title: "Client created",
          description: response || "Client has been created successfully",
        })
      }
      navigate("/clients")
    } catch (error) {
      console.error("Error saving client:", error)
      toast({
        title: "Error",
        description: "Failed to save client. Please check your data and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Preferences</FormLabel>
                  <FormControl>
                    <Input placeholder="Client order preferences" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment History</FormLabel>
                  <FormControl>
                    <Input placeholder="Payment history" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Order</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingOrders}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingOrders ? "Loading orders..." : "Select an order"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.orderID} value={order.orderID.toString()}>
                          Order #{order.orderID} - {order.deliveryStatus} - ${order.quantityOrdered}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/clients")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
