"use client"

// Update sustainability detail page to include predictions and link to edit page
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart, LineChart, Leaf, Droplets, Trash2, Edit } from "lucide-react"
import PredictionService from "@/services/prediction-service"

// Define types
type SustainabilityMetric = {
  id: string
  name: string
  category: string
  value: number
  unit: string
  target: number
  date: string
  status: "good" | "warning" | "critical"
  description: string
  history: {
    date: string
    value: number
  }[]
  relatedMetrics: {
    id: string
    name: string
    value: number
    unit: string
  }[]
}

export default function SustainabilityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [metric, setMetric] = useState<SustainabilityMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState<any>(null)
  const [predictionsLoading, setPredictionsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch sustainability metric details
  useEffect(() => {
    const fetchMetricDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sustainability/${id}`)
        setMetric(response.data)
      } catch (error) {
        console.error("Error fetching sustainability metric details:", error)
        toast({
          title: "Error",
          description: "Failed to fetch sustainability metric details",
          variant: "destructive",
        })

        // Mock data for development
        const mockMetric = {
          id: id || "1",
          name: "Water Usage Efficiency",
          category: "Water",
          value: 78,
          unit: "%",
          target: 85,
          date: "2023-05-15",
          status: "warning" as const,
          description:
              "Measures the efficiency of water usage across all farming operations. This includes irrigation systems, water recycling, and rainwater harvesting.",
          history: [
            { date: "2023-01-15", value: 65 },
            { date: "2023-02-15", value: 68 },
            { date: "2023-03-15", value: 72 },
            { date: "2023-04-15", value: 75 },
            { date: "2023-05-15", value: 78 },
          ],
          relatedMetrics: [
            { id: "7", name: "Irrigation Efficiency", value: 82, unit: "%" },
            { id: "8", name: "Water Recycling Rate", value: 45, unit: "%" },
            { id: "9", name: "Rainwater Harvesting", value: 60, unit: "%" },
          ],
        }
        setMetric(mockMetric)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMetricDetails()
    }
  }, [id, toast])

  // Generate prediction for this metric
  useEffect(() => {
    const generatePrediction = async () => {
      if (!metric) return

      setPredictionsLoading(true)
      try {
        const result = await PredictionService.predictSustainabilityImprovements(metric.id)
        setPrediction(result)
      } catch (error) {
        console.error("Error generating prediction:", error)
      } finally {
        setPredictionsLoading(false)
      }
    }

    if (!loading && metric) {
      generatePrediction()
    }
  }, [metric, loading])

  // Delete this metric
  const handleDelete = async () => {
    if (!id) return

    if (window.confirm("Are you sure you want to delete this sustainability metric?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/sustainability/${id}`)
        toast({
          title: "Success",
          description: "Sustainability metric deleted successfully",
        })
        navigate("/sustainability")
      } catch (error) {
        console.error("Error deleting sustainability metric:", error)
        toast({
          title: "Error",
          description: "Failed to delete sustainability metric",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
        <div className="container mx-auto py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/app/sustainability")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Metrics
            </Button>
          </div>
          <div className="mt-6 text-center">
            <p>Loading metric details...</p>
          </div>
        </div>
    )
  }

  if (!metric) {
    return (
        <div className="container mx-auto py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/app/sustainability")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Metrics
            </Button>
          </div>
          <div className="mt-6 text-center">
            <p>Metric not found</p>
          </div>
        </div>
    )
  }

  // Calculate progress percentage
  const progressPercentage = (metric.value / metric.target) * 100

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "water":
        return <Droplets className="h-5 w-5 text-blue-500" />
      default:
        return <Leaf className="h-5 w-5 text-green-500" />
    }
  }

  return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/app/sustainability")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Metrics
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/app/sustainability/edit/${metric.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Metric
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                {getCategoryIcon(metric.category)}
                <div>
                  <CardTitle>{metric.name}</CardTitle>
                  <CardDescription>Category: {metric.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p>{metric.description}</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Current Value:{" "}
                    <span className="font-medium text-foreground">
                    {metric.value} {metric.unit}
                  </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Target:{" "}
                    <span className="font-medium text-foreground">
                    {metric.target} {metric.unit}
                  </span>
                  </p>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="mt-2">
                  <p className="text-sm">
                    Status:{" "}
                    <span className={getStatusColor(metric.status)}>
                    {metric.status === "good" ? "Good" : metric.status === "warning" ? "Needs Improvement" : "Critical"}
                  </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Related Metrics</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {metric.relatedMetrics.map((related) => (
                      <Card key={related.id} className="border border-muted">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{related.name}</p>
                            <p>
                              {related.value} {related.unit}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Prediction</CardTitle>
              <CardDescription>Machine learning based prediction for this metric</CardDescription>
            </CardHeader>
            <CardContent>
              {predictionsLoading ? (
                  <div className="py-10 text-center">
                    <p>Generating prediction...</p>
                  </div>
              ) : prediction ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-2xl font-bold">{prediction.currentValue}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Predicted Value</p>
                      <p className="text-2xl font-bold text-green-600">{prediction.predictedValue}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Improvement</p>
                      <p className="text-xl font-bold text-green-600">+{prediction.improvementPercentage}%</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {prediction.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm">
                              {rec}
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              ) : (
                  <div className="py-10 text-center">
                    <p>No prediction available</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>Track the progress of this metric over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                    <tr>
                      <th className="text-left py-2 px-4 border-b">Date</th>
                      <th className="text-left py-2 px-4 border-b">Value ({metric.unit})</th>
                      <th className="text-left py-2 px-4 border-b">Change</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metric.history.map((item, index) => {
                      const prevValue = index < metric.history.length - 1 ? metric.history[index + 1].value : item.value
                      const change = item.value - prevValue
                      const changePercent = (change / prevValue) * 100

                      return (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">{item.date}</td>
                            <td className="py-2 px-4 border-b">{item.value}</td>
                            <td className="py-2 px-4 border-b">
                              {index < metric.history.length - 1 && (
                                  <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                                {change >= 0 ? "+" : ""}
                                    {change.toFixed(1)} ({changePercent.toFixed(1)}%)
                              </span>
                              )}
                            </td>
                          </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Historical Trend</CardTitle>
                    <CardDescription>Value over time</CardDescription>
                  </div>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Comparison to Target</CardTitle>
                    <CardDescription>Current vs Target</CardDescription>
                  </div>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
