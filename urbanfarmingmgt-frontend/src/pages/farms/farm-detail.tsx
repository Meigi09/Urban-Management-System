import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Sprout, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Farm {
  farmID: number
  name: string
  location: string
  size: number
  cropTypes: string[]
  sustainabilityScore: number
  crops: Crop[]
  staff: StaffMember[]
}

interface Crop {
  cropID: number
  cropType: string
  plantingSchedule: string
  growingConditions: boolean
}

interface StaffMember {
  id: number
  name: string
  role: string
  isVolunteer: boolean
}

export default function FarmDetail() {
  const { id } = useParams()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/farms/${id}`)
        // setFarm(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setFarm({
            farmID: Number(id),
            name: "Green Valley Farm",
            location: "North Region, 123 Farm Road",
            size: 25,
            cropTypes: ["Vegetables", "Herbs"],
            sustainabilityScore: 85,
            crops: [
              {
                cropID: 1,
                cropType: "Tomatoes",
                plantingSchedule: "2023-03-15",
                growingConditions: true,
              },
              {
                cropID: 6,
                cropType: "Peppers",
                plantingSchedule: "2023-03-20",
                growingConditions: true,
              },
              {
                cropID: 8,
                cropType: "Basil",
                plantingSchedule: "2023-04-01",
                growingConditions: true,
              },
            ],
            staff: [
              {
                id: 1,
                name: "Michael Johnson",
                role: "Farm Manager",
                isVolunteer: false,
              },
              {
                id: 2,
                name: "Sarah Williams",
                role: "Horticulturist",
                isVolunteer: false,
              },
              {
                id: 3,
                name: "David Lee",
                role: "Volunteer",
                isVolunteer: true,
              },
            ],
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch farm details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchFarm()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading farm details...</span>
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Farm not found</p>
        <Button asChild className="mt-4">
          <Link to="/farms">Back to Farms</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/farms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{farm.name}</h1>
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
            <CardTitle>Farm Information</CardTitle>
            <CardDescription>Location and general details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-sm text-muted-foreground">{farm.location}</p>
            </div>
            <div>
              <h3 className="font-medium">Size</h3>
              <p className="text-sm text-muted-foreground">{farm.size} hectares</p>
            </div>
            <div>
              <h3 className="font-medium">Crop Types</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {farm.cropTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium">Sustainability Score</h3>
              <Badge className="mt-1 bg-emerald-100 text-emerald-800">{farm.sustainabilityScore}/100</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Sustainability Report
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Management</CardTitle>
            <CardDescription>Crops and staff information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="crops">
              <TabsList className="w-full">
                <TabsTrigger value="crops" className="flex-1">
                  Crops
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex-1">
                  Staff
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex-1">
                  Metrics
                </TabsTrigger>
              </TabsList>
              <TabsContent value="crops" className="space-y-4 pt-4">
                {farm.crops.map((crop) => (
                  <div key={crop.cropID} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{crop.cropType}</p>
                      <p className="text-sm text-muted-foreground">
                        Planted: {new Date(crop.plantingSchedule).toLocaleDateString()} •{" "}
                        {crop.growingConditions ? "Good Conditions" : "Poor Conditions"}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/crops/${crop.cropID}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Sprout className="mr-2 h-4 w-4" />
                  Add Crop
                </Button>
              </TabsContent>
              <TabsContent value="staff" className="space-y-4 pt-4">
                {farm.staff.map((person) => (
                  <div key={person.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.role} • {person.isVolunteer ? "Volunteer" : "Staff"}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/staff/${person.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Staff
                </Button>
              </TabsContent>
              <TabsContent value="metrics">
                <div className="flex items-center justify-center py-8">
                  <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Sustainability metrics will be displayed here</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
