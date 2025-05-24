import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Package, User, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Order {
  orderId: number
  clientId: number
  clientName: string
  orderDate: string
  deliveryStatus: string
  inventoryId: number
  produceType: string
  quantityOrdered: number
  deliveryAddress: string
  paymentStatus: string
  totalAmount: number
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/orders/${id}`)
        // setOrder(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setOrder({
            orderId: Number(id),
            clientId: 1,
            clientName: "John Smith",
            orderDate: "2023-07-20",
            deliveryStatus: "Processing",
            inventoryId: 101,
            produceType: "Tomatoes",
            quantityOrdered: 50,
            deliveryAddress: "123 Main St, Anytown, USA",
            paymentStatus: "Paid",
            totalAmount: 250,
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
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
        <Button asChild className="mt-4">
          <Link to="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === "Delivered") return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    if (status === "Shipped") return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
    if (status === "Processing") return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
    if (status === "Pending") return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
    if (status === "Cancelled") return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    return <Badge>{status}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    if (status === "Paid") return <Badge className="bg-green-100 text-green-800">Paid</Badge>
    if (status === "Pending") return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    if (status === "Failed") return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    return <Badge>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          {order.deliveryStatus !== "Delivered" && order.deliveryStatus !== "Cancelled" && (
            <Button variant="outline" size="icon" className="text-destructive">
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details about this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Client</h3>
              <p className="text-sm text-muted-foreground">{order.clientName}</p>
            </div>
            <div>
              <h3 className="font-medium">Order Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h3 className="font-medium">Product</h3>
              <p className="text-sm text-muted-foreground">{order.produceType}</p>
            </div>
            <div>
              <h3 className="font-medium">Quantity</h3>
              <p className="text-sm text-muted-foreground">{order.quantityOrdered} kg</p>
            </div>
            <div>
              <h3 className="font-medium">Total Amount</h3>
              <p className="text-sm text-muted-foreground">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-medium">Delivery Address</h3>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/app/clients/${order.clientId}`}>
                <User className="mr-2 h-4 w-4" />
                View Client
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/app/inventory/${order.inventoryId}`}>
                <Package className="mr-2 h-4 w-4" />
                View Inventory
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current status and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Delivery Status</h3>
              <div className="mt-1">{getStatusBadge(order.deliveryStatus)}</div>
            </div>
            <div>
              <h3 className="font-medium">Payment Status</h3>
              <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Status Timeline</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-800">
                    <span className="text-xs">⋯</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">In progress</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <span className="text-xs">○</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <span className="text-xs">○</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Truck className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
