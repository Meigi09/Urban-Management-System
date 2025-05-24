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
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { cropApi } from "@/lib/api"

interface Crop {
  cropID: number
  cropType: string
  plantingSchedule: string
  growingConditions: boolean
  farmID: number
  farmName: string
  locationRequirement: string
  growingSeason: string
}

export default function Crops() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setIsLoading(true)
        const response = await cropApi.getAll()
        setCrops(response.data)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch crops",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchCrops()
  }, [toast])

  const handleDeleteCrop = async (cropId: number) => {
    try {
      await cropApi.delete(cropId)
      setCrops(crops.filter((crop) => crop.cropID !== cropId))
      toast({
        title: "Success",
        description: "Crop deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Crop>[] = [
    {
      accessorKey: "cropID",
      header: "ID",
    },
    {
      accessorKey: "cropType",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Crop Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "farmName",
      header: "Farm",
    },
    {
      accessorKey: "plantingSchedule",
      header: "Planting Date",
      cell: ({ row }) => formatDate(row.original.plantingSchedule),
    },
    {
      accessorKey: "growingConditions",
      header: "Growing Conditions",
      cell: ({ row }) => (
        <Badge variant={row.original.growingConditions ? "default" : "destructive"}>
          {row.original.growingConditions ? "Good" : "Poor"}
        </Badge>
      ),
    },
    {
      accessorKey: "locationRequirement",
      header: "Location",
    },
    {
      accessorKey: "growingSeason",
      header: "Season",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const crop = row.original

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
                <Link to={`/crops/${crop.cropID}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/crops/edit/${crop.cropID}`}>Edit crop</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/harvests/new?cropId=${crop.cropID}`}>Record harvest</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/sustainability/new?cropId=${crop.cropID}`}>Track metrics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteCrop(crop.cropID)} className="text-destructive">
                Delete crop
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
        <h1 className="text-2xl font-bold">Crops</h1>
        <Button asChild>
          <Link to="/crops/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Crop
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading crops...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={crops} searchPlaceholder="Search crops..." />
      )}
    </div>
  )
}
