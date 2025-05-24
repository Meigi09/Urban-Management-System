"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, ShoppingCart, Leaf, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface Inventory {
  inventoryId: number
  produceType: string
  quantity: number
  status: string
  harvestId: number
  farmId: number
  farmName: string
  maxCapacity: number
  orders: Order[]
}

interface Order {
  orderId: number
  clientName: string
  orderDate: string
  quantityOrdered: number
  deliveryStatus: string
}

export default function InventoryDetail() {
  const { id } = useParams()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/inventory/${id}`)
        // setInventory(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setInventory({
            inventoryId: Number(id),
            produceType: "Tomatoes",
            quantity: 350,
            status: "Available",
            harvestId: 1,
            farmId: 1,
            farmName: "Green Valley Farm",
            maxCapacity: 500,
            orders: [
              {
                orderId: 1001,
                clientName: "John Smith",
                orderDate: "2023-07-20",
                quantityOrdered: 50,
                deliveryStatus: "Delivered",
              },
              {
                orderId: 1008,
                clientName: "Emily Parker",
                orderDate: "2023-07-22",
                quantityOrdered: 30,
                deliveryStatus: "Processing",
              },
              {
                orderId: 1015,
                clientName: "Michael Brown",
                orderDate: "2023-07-25",
                quantityOrdered: 40,
                deliveryStatus: "Pending",
              },
            ],
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
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
        <Button asChild className="mt-4">
          <Link to="/inventory">Back to Inventory</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === "Available") return <Badge className="bg-green-100 text-green-800">Available</Badge>
    if (status === "Low Stock") return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    if (status === "Out of Stock") return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    return <Badge>{status}</Badge>
  }

  const getOrderStatusBadge = (status: string) => {
    if (status === "Delivered") return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    if (status === "Shipped") return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
    if (status === "Processing") return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
    if (status === "Pending") return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
    if (status === "Cancelled") return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    return <Badge>{status}</Badge>
  }

  const stockPercentage = (inventory.quantity / inventory.maxCapacity) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {inventory.produceType} (#{inventory.inventoryId})
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Information</CardTitle>
            <CardDescription>Current stock and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Produce Type</h3>
              <p className="text-sm text-muted-foreground">{inventory.produceType}</p>
            </div>
            <div>
              <h3 className="font-medium">Farm</h3>
              <p className="text-sm text-muted-foreground">{inventory.farmName}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <div className="mt-1">{getStatusBadge(inventory.status)}</div>
            </div>
            <div>
              <h3 className="font-medium">Stock Level</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {inventory.quantity} kg / {inventory.maxCapacity} kg
                  </span>
                  <span className="text-sm font-medium">{Math.round(stockPercentage)}%</span>
                </div>
                <Progress value={stockPercentage} className="h-2" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Storage Location</h3>
              <p className="text-sm text-muted-foreground">Warehouse A, Section 3</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/app/harvests/${inventory.harvestId}`}>
                <Leaf className="mr-2 h-4 w-4" />
                View Harvest
              </Link>
            </Button>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Orders</CardTitle>
            <CardDescription>Orders using this inventory item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inventory.orders.length > 0 ? (
              inventory.orders.map((order) => (
                <div key={order.orderId} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Order #{order.orderId}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.clientName} • {new Date(order.orderDate).toLocaleDateString()} • {order.quantityOrdered} kg
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getOrderStatusBadge(order.deliveryStatus)}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/app/orders/${order.orderId}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No orders found for this inventory item</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View All Related Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
