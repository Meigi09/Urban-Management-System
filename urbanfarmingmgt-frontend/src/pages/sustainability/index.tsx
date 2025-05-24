"use client"

// Update sustainability index page to link to new and edit pages
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import PredictionService, { type SustainabilityPrediction } from "@/services/prediction-service"

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
}

export default function SustainabilityPage() {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<SustainabilityPrediction[]>([])
  const [predictionsLoading, setPredictionsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch sustainability metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sustainability`)
        setMetrics(response.data)
      } catch (error) {
        console.error("Error fetching sustainability metrics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch sustainability metrics",
          variant: "destructive",
        })

        // Mock data for development
        const mockMetrics = [
          {
            id: "1",
            name: "Water Usage Efficiency",
            category: "Water",
            value: 78,
            unit: "%",
            target: 85,
            date: "2023-05-15",
            status: "warning" as const,
          },
          {
            id: "2",
            name: "Carbon Footprint",
            category: "Emissions",
            value: 65,
            unit: "tons CO2e",
            target: 50,
            date: "2023-05-15",
            status: "critical" as const,
          },
          {
            id: "3",
            name: "Renewable Energy Usage",
            category: "Energy",
            value: 42,
            unit: "%",
            target: 60,
            date: "2023-05-15",
            status: "critical" as const,
          },
          {
            id: "4",
            name: "Waste Recycling Rate",
            category: "Waste",
            value: 82,
            unit: "%",
            target: 90,
            date: "2023-05-15",
            status: "warning" as const,
          },
          {
            id: "5",
            name: "Biodiversity Index",
            category: "Biodiversity",
            value: 72,
            unit: "index",
            target: 75,
            date: "2023-05-15",
            status: "warning" as const,
          },
          {
            id: "6",
            name: "Soil Health Score",
            category: "Soil",
            value: 88,
            unit: "score",
            target: 85,
            date: "2023-05-15",
            status: "good" as const,
          },
        ]
        setMetrics(mockMetrics)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [toast])

  // Generate predictions for metrics
  useEffect(() => {
    const generatePredictions = async () => {
      if (metrics.length === 0) return

      setPredictionsLoading(true)
      try {
        const predictionPromises = metrics
            .slice(0, 3)
            .map((metric) => PredictionService.predictSustainabilityImprovements(metric.id))

        const results = await Promise.all(predictionPromises)
        setPredictions(results)
      } catch (error) {
        console.error("Error generating predictions:", error)
      } finally {
        setPredictionsLoading(false)
      }
    }

    if (!loading) {
      generatePredictions()
    }
  }, [metrics, loading])

  // Delete a metric
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/sustainability/${id}`)
      setMetrics(metrics.filter((metric) => metric.id !== id))
      toast({
        title: "Success",
        description: "Sustainability metric deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting sustainability metric:", error)
      toast({
        title: "Error",
        description: "Failed to delete sustainability metric",
        variant: "destructive",
      })
    }
  }

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Metric Name",
      cell: ({ row }: { row: any }) => (
          <Link to={`/sustainability/${row.original.id}`} className="font-medium hover:underline">
            {row.original.name}
          </Link>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "value",
      header: "Current Value",
      cell: ({ row }: { row: any }) => (
          <div>
            {row.original.value} {row.original.unit}
          </div>
      ),
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }: { row: any }) => (
          <div>
            {row.original.target} {row.original.unit}
          </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status
        return (
            <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
                    status === "good"
                        ? "bg-green-100 text-green-800"
                        : status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                }`}
            >
              {status === "good" ? "Good" : status === "warning" ? "Needs Improvement" : "Critical"}
            </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/sustainability/edit/${row.original.id}`)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
              Delete
            </Button>
          </div>
      ),
    },
  ]

  return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sustainability Metrics</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/sustainability/recommendations")}>View Recommendations</Button>
            <Button onClick={() => navigate("/sustainability/action-plan")}>Action Plan</Button>
            <Button onClick={() => navigate("/sustainability/new")}>Add New Metric</Button>
          </div>
        </div>

        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>All Sustainability Metrics</CardTitle>
                <CardDescription>Monitor and manage all sustainability metrics across your farms</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={metrics} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Metrics by Category</CardTitle>
                    <CardDescription>Distribution of sustainability metrics</CardDescription>
                  </div>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    {loading ? (
                        <p>Loading chart data...</p>
                    ) : (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Progress Towards Targets</CardTitle>
                    <CardDescription>Current values vs targets</CardDescription>
                  </div>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    {loading ? (
                        <p>Loading chart data...</p>
                    ) : (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Historical Trends</CardTitle>
                    <CardDescription>Sustainability metrics over time</CardDescription>
                  </div>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    {loading ? (
                        <p>Loading chart data...</p>
                    ) : (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Predictions</CardTitle>
                <CardDescription>
                  Using machine learning to predict future sustainability metrics and suggest improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                    <div className="py-10 text-center">
                      <p>Generating predictions...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                      {predictions.map((prediction) => (
                          <Card key={prediction.metricId} className="border border-green-200 bg-green-50">
                            <CardHeader>
                              <CardTitle className="text-lg">{prediction.metricName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
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
                                    <p className="text-2xl font-bold text-green-600">+{prediction.improvementPercentage}%</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Recommendations:</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {prediction.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm">
                                          {rec}
                                        </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
