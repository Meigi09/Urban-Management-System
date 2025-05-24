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
import { inventoryApi } from "@/services/api-integration"
import type { Inventory } from "@/types/models"

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const inventoryData = await inventoryApi.getAll()
        setInventory(inventoryData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching inventory:", error)
        toast({
          title: "Error",
          description: "Failed to fetch inventory from database. Please check your backend connection.",
          variant: "destructive",
        })
        setInventory([]) // Set empty array on error
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [toast])

  const handleDeleteInventory = async (inventoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this inventory item? This action cannot be undone.")) {
      return
    }

    try {
      await inventoryApi.delete(inventoryId)
      setInventory(inventory.filter((item) => item.inventoryID !== inventoryId))
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting inventory:", error)
      toast({
        title: "Error",
        description: "Failed to delete inventory item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFreshnessStatusBadge = (freshnessStatus: boolean) => {
    return freshnessStatus ?
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">Fresh</Badge> :
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">Not Fresh</Badge>
  }

  const getStockStatusBadge = (stock: number) => {
    if (stock > 50) return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">High Stock</Badge>
    if (stock > 10) return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">Medium Stock</Badge>
    if (stock > 0) return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200">Low Stock</Badge>
    return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">Out of Stock</Badge>
  }

  const columns: ColumnDef<Inventory>[] = [
    {
      accessorKey: "inventoryID",
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
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => `${row.original.quantity}`,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => getStockStatusBadge(row.original.stock),
    },
    {
      accessorKey: "storageLocation",
      header: "Storage Location",
    },
    {
      accessorKey: "freshnessStatus",
      header: "Freshness",
      cell: ({ row }) => getFreshnessStatusBadge(row.original.freshnessStatus),
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
                <Link to={`/inventory/${item.inventoryID}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/inventory/${item.inventoryID}/edit`}>Edit item</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/orders/new?inventoryId=${item.inventoryID}`}>Create order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteInventory(item.inventoryID)} className="text-destructive">
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
