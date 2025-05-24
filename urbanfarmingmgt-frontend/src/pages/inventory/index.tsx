"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { inventoryApi } from "@/lib/api"

interface Inventory {
  inventoryId: number
  produceType: string
  quantity: number
  status: string
  harvestId: number
  farmId: number
  farmName: string
}

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const response = await inventoryApi.getAll()
        setInventory(response.data)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch inventory",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [toast])

  const handleDeleteInventory = async (inventoryId: number) => {
    try {
      await inventoryApi.delete(inventoryId)
      setInventory(inventory.filter((item) => item.inventoryId !== inventoryId))
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "Available") return <Badge className="bg-green-100 text-green-800">Available</Badge>
    if (status === "Low Stock") return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    if (status === "Out of Stock") return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    return <Badge>{status}</Badge>
  }

  const columns: ColumnDef<Inventory>[] = [
    {
      accessorKey: "inventoryId",
      header: "ID",
    },
    {
      accessorKey: "produceType",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Produce Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Quantity (kg)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "farmName",
      header: "Farm",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original

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
                <Link to={`/inventory/${item.inventoryId}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/inventory/${item.inventoryId}/update-stock`}>Update stock</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/orders/new?inventoryId=${item.inventoryId}`}>Link to order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/inventory/${item.inventoryId}/check-availability`}>Check availability</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteInventory(item.inventoryId)} className="text-destructive">
                Delete item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button asChild>
          <Link to="/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory Item
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading inventory...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={inventory} searchPlaceholder="Search inventory..." />
      )}
    </div>
  )
}
