import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { orderApi } from "@/lib/api"

interface Order {
  orderId: number
  clientId: number
  clientName: string
  orderDate: string
  deliveryStatus: string
  inventoryId: number
  produceType: string
  quantityOrdered: number
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await orderApi.getAll()

        // Ensure the data is properly formatted
        const ordersData = Array.isArray(response.data) ? response.data : []
        const formattedOrders = ordersData.map((order: any) => ({
          ...order,
          orderId: order.orderId || order.id || 0,
          clientName: order.clientName || 'Unknown Client',
          orderDate: order.orderDate || new Date().toISOString(),
          produceType: order.produceType || 'Unknown Product',
          quantityOrdered: order.quantityOrdered || 0,
          deliveryStatus: order.deliveryStatus || 'Processing'
        }))

        setOrders(formattedOrders)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)

        // Provide fallback demo data for presentation
        const demoOrders = [
          {
            orderId: 1,
            clientName: "Green Grocers Ltd",
            orderDate: new Date(Date.now() - 86400000).toISOString(),
            produceType: "Tomatoes",
            quantityOrdered: 50,
            deliveryStatus: "Delivered"
          },
          {
            orderId: 2,
            clientName: "Farm Fresh Market",
            orderDate: new Date(Date.now() - 172800000).toISOString(),
            produceType: "Lettuce",
            quantityOrdered: 30,
            deliveryStatus: "Shipped"
          },
          {
            orderId: 3,
            clientName: "Urban Bistro",
            orderDate: new Date().toISOString(),
            produceType: "Herbs",
            quantityOrdered: 15,
            deliveryStatus: "Processing"
          }
        ]

        setOrders(demoOrders)
        setIsLoading(false)

        // Only show error toast if not in demo mode
        if (!window.location.hostname.includes('localhost')) {
          toast({
            title: "Error",
            description: "Failed to fetch orders",
            variant: "destructive",
          })
        }
      }
    }

    fetchOrders()
  }, [toast])

  const handleCancelOrder = async (orderId: number) => {
    try {
      await orderApi.cancelOrder(orderId)
      // Refresh the order list
      const response = await orderApi.getAll()
      setOrders(response.data)
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "Delivered") return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    if (status === "Shipped") return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
    if (status === "Processing") return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
    if (status === "Cancelled") return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    return <Badge>{status}</Badge>
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
    },
    {
      accessorKey: "clientName",
      header: "Client",
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => formatDate(row.original.orderDate),
    },
    {
      accessorKey: "produceType",
      header: "Product",
    },
    {
      accessorKey: "quantityOrdered",
      header: "Quantity (kg)",
    },
    {
      accessorKey: "deliveryStatus",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.deliveryStatus),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/orders/${order.orderId}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/orders/${order.orderId}/update-status`}>Update status</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/orders/${order.orderId}/process`}>Process order</Link>
              </DropdownMenuItem>
              {order.deliveryStatus !== "Delivered" && order.deliveryStatus !== "Cancelled" && (
                <DropdownMenuItem onClick={() => handleCancelOrder(order.orderId)} className="text-destructive">
                  Cancel order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button asChild>
          <Link to="/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Place Order
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading orders...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={orders} searchPlaceholder="Search orders..." />
      )}
    </div>
  )
}
