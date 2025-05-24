"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
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
import { staffApi } from "@/lib/api"

interface StaffMember {
  id: number
  name: string
  role: string
  isVolunteer: boolean
  farmId: number
  farmName: string
  tasks: string[]
  workHours: number
}

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const farmId = searchParams.get("farmId")

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true)
        let response

        if (farmId) {
          response = await staffApi.getByFarm(Number(farmId))
        } else {
          response = await staffApi.getAll()
        }

        setStaff(response.data)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch staff and volunteers",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchStaff()
  }, [toast, farmId])

  const handleDeleteStaff = async (id: number) => {
    try {
      await staffApi.delete(id)
      setStaff(staff.filter((person) => person.id !== id))
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<StaffMember>[] = [
    {
      accessorKey: "id",
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
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "isVolunteer",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.isVolunteer ? "outline" : "default"}>
          {row.original.isVolunteer ? "Volunteer" : "Staff"}
        </Badge>
      ),
    },
    {
      accessorKey: "farmName",
      header: "Farm",
    },
    {
      accessorKey: "tasks",
      header: "Tasks",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tasks.map((task) => (
            <Badge key={task} variant="outline" className="mr-1">
              {task}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "workHours",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Hours
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const person = row.original

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
                <Link to={`/staff/${person.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/staff/edit/${person.id}`}>Edit details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/staff/${person.id}/assign-farm`}>Assign to farm</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/staff/${person.id}/assign-task`}>Assign task</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/staff/${person.id}/update-hours`}>Update work hours</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteStaff(person.id)} className="text-destructive">
                Remove
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
        <h1 className="text-2xl font-bold">Staff & Volunteers</h1>
        <Button asChild>
          <Link to="/staff/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Person
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading staff and volunteers...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={staff} searchPlaceholder="Search staff and volunteers..." />
      )}
    </div>
  )
}
