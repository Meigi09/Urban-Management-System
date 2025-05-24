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
import { harvestApi } from "@/lib/api"

// Harvest interface matching your backend model exactly
interface Harvest {
  harvestID: number
  date: string
  yield: number
  qualityRating: number
  crop: {
    cropID: number
    cropType: string
    [key: string]: any
  }
  farm: {
    farmID: number
    name: string
    [key: string]: any
  }
  inventory: {
    inventoryID: number
    [key: string]: any
  }
}

export default function Harvests() {
  const [harvests, setHarvests] = useState<Harvest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        setIsLoading(true)
        const response = await harvestApi.getAll()

        // Use the data directly from your backend - no mock data
        const harvestsData = Array.isArray(response.data) ? response.data : []
        setHarvests(harvestsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching harvests:", error)
        toast({
          title: "Error",
          description: "Failed to fetch harvests from database",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHarvests()
  }, [toast])

  const handleDeleteHarvest = async (harvestId: number) => {
    try {
      await harvestApi.delete(harvestId)
      setHarvests(harvests.filter((harvest) => harvest.harvestId !== harvestId))
      toast({
        title: "Success",
        description: "Harvest deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete harvest",
        variant: "destructive",
      })
    }
  }

  const getQualityBadge = (rating: number) => {
    if (rating === 5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rating === 4) return <Badge className="bg-emerald-100 text-emerald-800">Good</Badge>
    if (rating === 3) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    if (rating === 2) return <Badge className="bg-orange-100 text-orange-800">Below Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const columns: ColumnDef<Harvest>[] = [
    {
      accessorKey: "harvestID",
      header: "Harvest ID",
    },
    {
      accessorKey: "crop",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Crop Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.crop?.cropType || 'Unknown',
    },
    {
      accessorKey: "farm",
      header: "Farm",
      cell: ({ row }) => row.original.farm?.name || 'Unknown',
    },
    {
      accessorKey: "date",
      header: "Harvest Date",
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: "yield",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Yield (kg)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "qualityRating",
      header: "Quality",
      cell: ({ row }) => getQualityBadge(row.original.qualityRating),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const harvest = row.original

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
                <Link to={`/harvests/${harvest.harvestID}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/harvests/${harvest.harvestID}/update-quality`}>Update quality</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/harvests/${harvest.harvestID}/update-yield`}>Update yield</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/inventory/new?harvestId=${harvest.harvestID}`}>Transfer to inventory</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteHarvest(harvest.harvestID)} className="text-destructive">
                Delete harvest
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
        <h1 className="text-2xl font-bold">Harvests</h1>
        <Button asChild>
          <Link to="/harvests/new">
            <Plus className="mr-2 h-4 w-4" />
            Record Harvest
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading harvests...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={harvests} searchPlaceholder="Search harvests..." />
      )}
    </div>
  )
}
