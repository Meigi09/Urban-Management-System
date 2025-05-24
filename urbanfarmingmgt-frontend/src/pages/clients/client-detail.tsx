"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, ShoppingCart, History, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { clientApi } from "@/lib/api"

interface Client {
  clientID: number
  name: string
  contactInfo: string
  orderPreferences: string
  paymentHistory: string
  orders: Order[]
}

interface Order {
  orderId: number
  orderDate: string
  deliveryStatus: string
  produceType: string
  quantityOrdered: number
}

export default function ClientDetail() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
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

  const handleDeleteClient = async () => {
    if (!client) return

    try {
      await clientApi.delete(client.clientID)
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
      // Navigate back to clients list
      window.location.href = "/clients"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

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
        <Button asChild className="mt-4">
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/app/clients/edit/${client.clientID}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={handleDeleteClient}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Contact details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Contact Information</h3>
              <p className="text-sm text-muted-foreground">{client.contactInfo}</p>
            </div>
            <div>
              <h3 className="font-medium">Order Preferences</h3>
              <p className="text-sm text-muted-foreground">{client.orderPreferences}</p>
            </div>
            <div>
              <h3 className="font-medium">Payment History</h3>
              <p className="text-sm text-muted-foreground">{client.paymentHistory}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/orders/new?clientId=${client.clientID}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Place New Order
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Activity</CardTitle>
            <CardDescription>Recent orders and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="w-full">
                <TabsTrigger value="orders" className="flex-1">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  History
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">
                  Preferences
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="space-y-4 pt-4">
                {client.orders && client.orders.length > 0 ? (
                  client.orders.map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Order #{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString()} • {order.produceType} (
                          {order.quantityOrdered}
                          kg)
                        </p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order.orderId}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No orders found for this client</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="history">
                <div className="flex items-center justify-center py-8">
                  <History className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment history will be displayed here</span>
                </div>
              </TabsContent>
              <TabsContent value="preferences">
                <div className="flex items-center justify-center py-8">
                  <Heart className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Client preferences will be displayed here</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
