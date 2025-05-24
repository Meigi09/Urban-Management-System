import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, RefreshCw, Eye, Edit, Trash2, Users, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EnhancedDataTable } from "@/components/enhanced-data-table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { farmApi } from "@/services/api-integration"
import { CanCreate, CanDelete, CanUpdate } from "@/components/role-guard"
import { useRoleAuth } from "@/hooks/use-role-auth"
import type { Farm } from "@/types/models"

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { role } = useRoleAuth()

  const fetchFarms = async () => {
    try {
      setIsLoading(true)
      const farms = await farmApi.getAll()
      setFarms(farms)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching farms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch farms from database. Please check your backend connection.",
        variant: "destructive",
      })
      setFarms([]) // Set empty array on error
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFarms()
  }, [toast])

  // Expose refresh function for external use
  useEffect(() => {
    const handleFarmCreated = () => {
      fetchFarms()
    }

    // Listen for custom events when farms are created
    window.addEventListener('farmCreated', handleFarmCreated)

    return () => {
      window.removeEventListener('farmCreated', handleFarmCreated)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchFarms()
    setIsRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Farm data has been updated",
    })
  }

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
      accessorKey: "totalPlantingArea",
      header: "Area (ha)",
      cell: ({ row }) => {
        const area = row.original.totalPlantingArea || 0
        return <span>{area.toFixed(1)} ha</span>
      },
    },
    {
      accessorKey: "crops",
      header: "Crops",
      cell: ({ row }) => {
        const crops = row.original.crops || []
        return (
          <div className="flex flex-wrap gap-1">
            {crops.length > 0 ? (
              crops.slice(0, 3).map((crop, index: number) => (
                <Badge key={index} variant="outline">
                  {crop.cropType || 'Unknown'}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No crops</span>
            )}
            {crops.length > 3 && (
              <Badge variant="secondary">+{crops.length - 3} more</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "assignedStaff",
      header: "Staff Count",
      cell: ({ row }) => {
        const staff = row.original.assignedStaff || []
        return <span>{staff.length}</span>
      },
    },
    {
      accessorKey: "sustainabilityMetrics",
      header: "Sustainability Metrics",
      cell: ({ row }) => {
        const metrics = row.original.sustainabilityMetrics || []
        return <span>{metrics.length} metric(s)</span>
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
                <Link to={`/farms/${farm.farmID}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <CanUpdate>
                <DropdownMenuItem asChild>
                  <Link to={`/farms/edit/${farm.farmID}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit farm
                  </Link>
                </DropdownMenuItem>
              </CanUpdate>
              <CanCreate>
                <DropdownMenuItem asChild>
                  <Link to={`/crops/new?farmId=${farm.farmID}`}>
                    <Sprout className="mr-2 h-4 w-4" />
                    Track crops
                  </Link>
                </DropdownMenuItem>
              </CanCreate>
              <DropdownMenuItem asChild>
                <Link to={`/staff?farmId=${farm.farmID}`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage staff
                </Link>
              </DropdownMenuItem>
              <CanDelete>
                <DropdownMenuItem onClick={() => handleDeleteFarm(farm.farmID)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete farm
                </DropdownMenuItem>
              </CanDelete>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleRowClick = (farm: Farm) => {
    navigate(`/farms/${farm.farmID}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Farms Management</h1>
          <p className="text-muted-foreground">
            Manage your urban farms and track their performance. You have {role} access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <CanCreate>
            <Button asChild>
              <Link to="/app/farms/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Farm
              </Link>
            </Button>
          </CanCreate>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading farms...</span>
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={farms}
          searchKey="name"
          searchPlaceholder="Search farms by name..."
          onRowClick={handleRowClick}
        />
      )}
    </div>
  )
}
