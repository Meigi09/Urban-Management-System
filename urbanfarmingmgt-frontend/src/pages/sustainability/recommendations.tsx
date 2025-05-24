"use client"

// Add AI-powered recommendations page
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react"
import PredictionService, { type SustainabilityPrediction } from "@/services/prediction-service"

// Define types
type SustainabilityMetric = {
  id: string
  name: string
  category: string
  value: number
  unit: string
  target: number
  status: "good" | "warning" | "critical"
}

export default function SustainabilityRecommendationsPage() {
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
            status: "warning" as const,
          },
          {
            id: "2",
            name: "Carbon Footprint",
            category: "Emissions",
            value: 65,
            unit: "tons CO2e",
            target: 50,
            status: "critical" as const,
          },
          {
            id: "3",
            name: "Renewable Energy Usage",
            category: "Energy",
            value: 42,
            unit: "%",
            target: 60,
            status: "critical" as const,
          },
          {
            id: "4",
            name: "Waste Recycling Rate",
            category: "Waste",
            value: 82,
            unit: "%",
            target: 90,
            status: "warning" as const,
          },
          {
            id: "5",
            name: "Biodiversity Index",
            category: "Biodiversity",
            value: 72,
            unit: "index",
            target: 75,
            status: "warning" as const,
          },
          {
            id: "6",
            name: "Soil Health Score",
            category: "Soil",
            value: 88,
            unit: "score",
            target: 85,
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
        // Filter metrics that need improvement
        const metricsNeedingImprovement = metrics.filter(
            (metric) => metric.status === "warning" || metric.status === "critical",
        )

        const predictionPromises = metricsNeedingImprovement.map((metric) =>
            PredictionService.predictSustainabilityImprovements(metric.id),
        )

        const results = await Promise.all(predictionPromises)

        // Sort by improvement potential (highest first)
        results.sort((a, b) => b.improvementPercentage - a.improvementPercentage)

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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/sustainability")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Metrics
            </Button>
            <h1 className="text-3xl font-bold">Sustainability Recommendations</h1>
          </div>
          <Button onClick={() => navigate("/sustainability/action-plan")}>
            View Action Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
            <CardDescription>
              Our AI has analyzed your sustainability metrics and generated these recommendations to help improve your
              farm's sustainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || predictionsLoading ? (
                <div className="py-10 text-center">
                  <p>Analyzing your sustainability data and generating recommendations...</p>
                </div>
            ) : predictions.length > 0 ? (
                <div className="space-y-6">
                  {predictions.map((prediction, index) => {
                    const metric = metrics.find((m) => m.id === prediction.metricId)
                    if (!metric) return null

                    return (
                        <Card key={prediction.metricId} className="border border-green-200 bg-green-50">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(metric.status)}
                                <CardTitle className="text-lg">{prediction.metricName}</CardTitle>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/sustainability/${metric.id}`)}>
                                View Details
                              </Button>
                            </div>
                            <CardDescription>
                              Category: {metric.category} | Current: {metric.value}
                              {metric.unit} | Target: {metric.target}
                              {metric.unit}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <p className="text-sm">Current</p>
                                  <p className="text-sm">Predicted</p>
                                </div>
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                                  {prediction.currentValue}
                                </span>
                                    </div>
                                    <div className="text-right">
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-600 text-white">
                                  {prediction.predictedValue}
                                </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                    <div
                                        style={{ width: `${(prediction.currentValue / prediction.predictedValue) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                    ></div>
                                  </div>
                                </div>
                                <p className="text-sm text-green-700 font-medium">
                                  Potential improvement: +{prediction.improvementPercentage}%
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Recommended Actions:</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                  {prediction.recommendations.map((rec, recIndex) => (
                                      <li key={recIndex} className="text-sm">
                                        {rec}
                                      </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-700 border-green-700 hover:bg-green-100"
                                    onClick={() => {
                                      toast({
                                        title: "Action added to plan",
                                        description: `Recommendations for ${prediction.metricName} added to your action plan`,
                                      })
                                    }}
                                >
                                  Add to Action Plan
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    )
                  })}
                </div>
            ) : (
                <div className="py-10 text-center">
                  <p>No recommendations available at this time. All metrics are performing well!</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
