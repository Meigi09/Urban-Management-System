"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Warehouse, CalendarClock, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface StaffMember {
  id: number
  name: string
  role: string
  isVolunteer: boolean
  farmId: number
  farmName: string
  tasks: string[]
  workHours: number
  contactInfo: string
  startDate: string
  skills: string[]
}

export default function StaffDetail() {
  const { id } = useParams()
  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/staff-and-volunteers/${id}`)
        // setStaff(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setStaff({
            id: Number(id),
            name: "Michael Johnson",
            role: "Farm Manager",
            isVolunteer: false,
            farmId: 1,
            farmName: "Green Valley Farm",
            tasks: ["Crop Planning", "Staff Management", "Inventory Oversight"],
            workHours: 40,
            contactInfo: "michael@example.com | (555) 987-6543",
            startDate: "2022-03-15",
            skills: ["Organic Farming", "Leadership", "Crop Rotation", "Sustainability"],
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch staff details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchStaff()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading staff details...</span>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Staff member not found</p>
        <Button asChild className="mt-4">
          <Link to="/staff">Back to Staff</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/staff">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{staff.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Role</h3>
              <div className="mt-1 flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{staff.role}</p>
                <Badge variant={staff.isVolunteer ? "outline" : "default"}>
                  {staff.isVolunteer ? "Volunteer" : "Staff"}
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Farm</h3>
              <p className="text-sm text-muted-foreground">{staff.farmName}</p>
            </div>
            <div>
              <h3 className="font-medium">Contact Information</h3>
              <p className="text-sm text-muted-foreground">{staff.contactInfo}</p>
            </div>
            <div>
              <h3 className="font-medium">Start Date</h3>
              <p className="text-sm text-muted-foreground">{new Date(staff.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Work Hours</h3>
              <p className="text-sm text-muted-foreground">{staff.workHours} hours per week</p>
            </div>
            <div>
              <h3 className="font-medium">Skills</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {staff.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/app/farms/${staff.farmId}`}>
                <Warehouse className="mr-2 h-4 w-4" />
                View Farm
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks & Schedule</CardTitle>
            <CardDescription>Current assignments and work schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Current Tasks</h3>
              <div className="mt-2 space-y-2">
                {staff.tasks.map((task, index) => (
                  <div key={index} className="flex items-center rounded-lg border p-3">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <p className="text-sm">{task}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Weekly Schedule</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Monday</p>
                  <p className="text-sm">8:00 AM - 4:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Tuesday</p>
                  <p className="text-sm">8:00 AM - 4:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Wednesday</p>
                  <p className="text-sm">8:00 AM - 4:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Thursday</p>
                  <p className="text-sm">8:00 AM - 4:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Friday</p>
                  <p className="text-sm">8:00 AM - 4:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Saturday</p>
                  <p className="text-sm text-muted-foreground">Off</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Sunday</p>
                  <p className="text-sm text-muted-foreground">Off</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <CalendarClock className="mr-2 h-4 w-4" />
              Update Hours
            </Button>
            <Button>
              <ClipboardList className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
