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
import { useToast } from "@/hooks/use-toast"
import { clientApi } from "@/lib/api"

interface Client {
  clientID: number
  name: string
  contactInfo: string
  orderPreferences: string
  paymentHistory: string
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const response = await clientApi.getAll()

        // Ensure the data is properly formatted
        const clientsData = Array.isArray(response.data) ? response.data : []
        const formattedClients = clientsData.map((client: any) => ({
          ...client,
          name: client.name || 'Unknown Client',
          contactInfo: client.contactInfo || 'No contact info',
          orderPreferences: client.orderPreferences || 'No preferences',
          paymentHistory: client.paymentHistory || 'No history'
        }))

        setClients(formattedClients)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching clients:", error)
        toast({
          title: "Error",
          description: "Failed to fetch clients from database. Please check your backend connection.",
          variant: "destructive",
        })
        setClients([]) // Set empty array on error
        setIsLoading(false)

        // Only show error toast if not in demo mode
        if (!window.location.hostname.includes('localhost')) {
          toast({
            title: "Error",
            description: "Failed to fetch clients",
            variant: "destructive",
          })
        }
      }
    }

    fetchClients()
  }, [toast])

  const handleDeleteClient = async (clientId: number) => {
    try {
      await clientApi.delete(clientId)
      setClients(clients.filter((client) => client.clientID !== clientId))
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "clientID",
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
      accessorKey: "contactInfo",
      header: "Contact Info",
    },
    {
      accessorKey: "orderPreferences",
      header: "Order Preferences",
    },
    {
      accessorKey: "paymentHistory",
      header: "Payment History",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original

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
                <Link to={`/clients/${client.clientID}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/clients/edit/${client.clientID}`}>Edit client</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClient(client.clientID)} className="text-destructive">
                Delete client
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
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link to="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading clients...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={clients} searchPlaceholder="Search clients..." />
      )}
    </div>
  )
}
