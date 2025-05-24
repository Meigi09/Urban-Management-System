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
import { farmApi } from "@/lib/api"

interface Farm {
  farmID: number
  name: string
  location: string
  size: number
  cropTypes: string[]
  sustainabilityScore: number
}

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true)
        const response = await farmApi.getAll()
        setFarms(response.data)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch farms",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchFarms()
  }, [toast])

  const handleDeleteFarm = async (farmId: number) => {
    try {
      await farmApi.delete(farmId)
      setFarms(farms.filter((farm) => farm.farmID !== farmId))
      toast({
        title: "Success",
        description: "Farm deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete farm",
        variant: "destructive",
      })
    }
  }

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 hover:bg-green-100/80"
    if (score >= 80) return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
    return "bg-red-100 text-red-800 hover:bg-red-100/80"
  }

  const columns: ColumnDef<Farm>[] = [
    {
      accessorKey: "farmID",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "size",
      header: "Size (ha)",
    },
    {
      accessorKey: "cropTypes",
      header: "Crop Types",
      cell: ({ row }) => {
        const cropTypes = row.original.cropTypes
        return (
          <div className="flex flex-wrap gap-1">
            {cropTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "sustainabilityScore",
      header: "Sustainability",
      cell: ({ row }) => {
        const score = row.original.sustainabilityScore
        return <Badge className={getSustainabilityColor(score)}>{score}/100</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const farm = row.original

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
                <Link to={`/farms/${farm.farmID}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/farms/edit/${farm.farmID}`}>Edit farm</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/crops/new?farmId=${farm.farmID}`}>Track crops</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/staff?farmId=${farm.farmID}`}>Manage staff</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteFarm(farm.farmID)} className="text-destructive">
                Delete farm
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
        <h1 className="text-2xl font-bold">Farms</h1>
        <Button asChild>
          <Link to="/farms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Farm
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading farms...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={farms} searchPlaceholder="Search farms..." />
      )}
    </div>
  )
}
