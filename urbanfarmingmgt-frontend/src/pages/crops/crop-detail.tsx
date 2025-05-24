"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Leaf, BarChart3, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Crop {
  cropID: number
  cropType: string
  plantingSchedule: string
  growingConditions: boolean
  farmID: number
  farmName: string
  locationRequirement: string
  growingSeason: string
  harvests: Harvest[]
  sustainabilityMetrics: SustainabilityMetric[]
}

interface Harvest {
  harvestId: number
  harvestDate: string
  yield: number
  qualityRating: number
}

interface SustainabilityMetric {
  id: number
  date: string
  waterUsage: number
  soilHealth: number
  pesticideApplication: number
  energyUsage: number
  sustainabilityScore: number
}

export default function CropDetail() {
  const { id } = useParams()
  const [crop, setCrop] = useState<Crop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/crops/${id}`)
        // setCrop(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setCrop({
            cropID: Number(id),
            cropType: "Tomatoes",
            plantingSchedule: "2023-03-15",
            growingConditions: true,
            farmID: 1,
            farmName: "Green Valley Farm",
            locationRequirement: "Greenhouse",
            growingSeason: "Summer",
            harvests: [
              {
                harvestId: 1,
                harvestDate: "2023-07-15",
                yield: 450,
                qualityRating: 5,
              },
              {
                harvestId: 6,
                harvestDate: "2023-06-20",
                yield: 380,
                qualityRating: 4,
              },
              {
                harvestId: 12,
                harvestDate: "2023-05-25",
                yield: 420,
                qualityRating: 5,
              },
            ],
            sustainabilityMetrics: [
              {
                id: 1,
                date: "2023-07-15",
                waterUsage: 25.5,
                soilHealth: 85,
                pesticideApplication: 5.2,
                energyUsage: 120,
                sustainabilityScore: 82,
              },
              {
                id: 7,
                date: "2023-06-15",
                waterUsage: 28.3,
                soilHealth: 82,
                pesticideApplication: 6.1,
                energyUsage: 125,
                sustainabilityScore: 78,
              },
            ],
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch crop details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchCrop()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading crop details...</span>
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Crop not found</p>
        <Button asChild className="mt-4">
          <Link to="/crops">Back to Crops</Link>
        </Button>
      </div>
    )
  }

  const getQualityBadge = (rating: number) => {
    if (rating === 5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rating === 4) return <Badge className="bg-emerald-100 text-emerald-800">Good</Badge>
    if (rating === 3) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    if (rating === 2) return <Badge className="bg-orange-100 text-orange-800">Below Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/crops">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{crop.cropType}</h1>
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
            <CardTitle>Crop Information</CardTitle>
            <CardDescription>Growing details and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Farm</h3>
              <p className="text-sm text-muted-foreground">{crop.farmName}</p>
            </div>
            <div>
              <h3 className="font-medium">Planting Schedule</h3>
              <p className="text-sm text-muted-foreground">{formatDate(crop.plantingSchedule)}</p>
            </div>
            <div>
              <h3 className="font-medium">Growing Conditions</h3>
              <Badge variant={crop.growingConditions ? "default" : "destructive"} className="mt-1">
                {crop.growingConditions ? "Good" : "Poor"}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium">Location Requirement</h3>
              <p className="text-sm text-muted-foreground">{crop.locationRequirement}</p>
            </div>
            <div>
              <h3 className="font-medium">Growing Season</h3>
              <p className="text-sm text-muted-foreground">{crop.growingSeason}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Update Planting Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crop Performance</CardTitle>
            <CardDescription>Harvests and sustainability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="harvests">
              <TabsList className="w-full">
                <TabsTrigger value="harvests" className="flex-1">
                  Harvests
                </TabsTrigger>
                <TabsTrigger value="sustainability" className="flex-1">
                  Sustainability
                </TabsTrigger>
              </TabsList>
              <TabsContent value="harvests" className="space-y-4 pt-4">
                {crop.harvests.map((harvest) => (
                  <div key={harvest.harvestId} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Harvest #{harvest.harvestId}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(harvest.harvestDate)} • Yield: {harvest.yield}kg •{" "}
                        {getQualityBadge(harvest.qualityRating)}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/harvests/${harvest.harvestId}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Leaf className="mr-2 h-4 w-4" />
                  Record Harvest
                </Button>
              </TabsContent>
              <TabsContent value="sustainability" className="space-y-4 pt-4">
                {crop.sustainabilityMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Metrics from {formatDate(metric.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        Water: {metric.waterUsage}L • Soil Health: {metric.soilHealth}/100 • Score:{" "}
                        {metric.sustainabilityScore}/100
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/sustainability/${metric.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Record Metrics
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
