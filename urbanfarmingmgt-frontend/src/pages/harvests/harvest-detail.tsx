import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Package, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Harvest {
  harvestId: number
  cropId: number
  cropType: string
  farmId: number
  farmName: string
  harvestDate: string
  yield: number
  qualityRating: number
  inventoryId: number
  notes: string
}

export default function HarvestDetail() {
  const { id } = useParams()
  const [harvest, setHarvest] = useState<Harvest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHarvest = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await api.get(`/harvests/${id}`)
        // setHarvest(response.data)

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setHarvest({
            harvestId: Number(id),
            cropId: 1,
            cropType: "Tomatoes",
            farmId: 1,
            farmName: "Green Valley Farm",
            harvestDate: "2023-07-15",
            yield: 450,
            qualityRating: 5,
            inventoryId: 101,
            notes:
              "Excellent harvest with high yield and quality. Weather conditions were optimal during the growing season.",
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch harvest details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHarvest()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading harvest details...</span>
      </div>
    )
  }

  if (!harvest) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Harvest not found</p>
        <Button asChild className="mt-4">
          <Link to="/harvests">Back to Harvests</Link>
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/harvests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Harvest #{harvest.harvestId} - {harvest.cropType}
          </h1>
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
            <CardTitle>Harvest Information</CardTitle>
            <CardDescription>Details about this harvest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Crop</h3>
              <p className="text-sm text-muted-foreground">{harvest.cropType}</p>
            </div>
            <div>
              <h3 className="font-medium">Farm</h3>
              <p className="text-sm text-muted-foreground">{harvest.farmName}</p>
            </div>
            <div>
              <h3 className="font-medium">Harvest Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(harvest.harvestDate)}</p>
            </div>
            <div>
              <h3 className="font-medium">Yield</h3>
              <p className="text-sm text-muted-foreground">{harvest.yield} kg</p>
            </div>
            <div>
              <h3 className="font-medium">Quality Rating</h3>
              <div className="mt-1 flex items-center space-x-2">
                {getQualityBadge(harvest.qualityRating)}
                <span className="text-sm text-muted-foreground">({harvest.qualityRating}/5)</span>
                <div className="ml-2">{renderStars(harvest.qualityRating)}</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Notes</h3>
              <p className="text-sm text-muted-foreground">{harvest.notes}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/crops/${harvest.cropId}`}>View Crop</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/farms/${harvest.farmId}`}>View Farm</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory information for this harvest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Inventory ID</h3>
              <p className="text-sm text-muted-foreground">#{harvest.inventoryId}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <Badge className="mt-1 bg-green-100 text-green-800">Available</Badge>
            </div>
            <div>
              <h3 className="font-medium">Current Quantity</h3>
              <p className="text-sm text-muted-foreground">350 kg</p>
            </div>
            <div>
              <h3 className="font-medium">Storage Location</h3>
              <p className="text-sm text-muted-foreground">Warehouse A, Section 3</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Package className="mr-2 h-4 w-4" />
              View in Inventory
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
