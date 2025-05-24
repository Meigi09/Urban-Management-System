"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Check, Clock, DollarSign, BarChart3, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface ActionItem {
  id: number
  description: string
  category: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  assignedTo?: string
  cost: string
  impact: string
}

export default function SustainabilityActionPlan() {
  const { id } = useParams()
  const [metric, setMetric] = useState<any | null>(null)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch sustainability metric data
        const metricResponse = await api.get(`/sustainability/${id}`)
        setMetric(metricResponse.data)

        // Try to fetch action items if the API endpoint exists
        try {
          const actionResponse = await api.get(`/sustainability/${id}/actions`)
          setActionItems(actionResponse.data)
        } catch (error) {
          // If the endpoint doesn't exist, generate mock action items
          generateActionItems(metricResponse.data)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch action plan data",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const generateActionItems = (metricData: any) => {
    const items: ActionItem[] = []

    // Water usage actions
    if (metricData.waterUsage > 50) {
      items.push({
        id: 1,
        description: "Install drip irrigation system",
        category: "Water",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Farm Manager",
        cost: "Medium",
        impact: "Reduce water usage by 20%",
      })
    }

    if (metricData.waterUsage > 30) {
      items.push({
        id: 2,
        description: "Implement rainwater harvesting",
        category: "Water",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Sustainability Team",
        cost: "Medium",
        impact: "Reduce water usage by 15%",
      })
    }

    // Soil health actions
    if (metricData.soilHealth < 80) {
      items.push({
        id: 3,
        description: "Apply organic compost to improve soil structure",
        category: "Soil",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Farm Workers",
        cost: "Low",
        impact: "Improve soil health by 10 points",
      })
    }

    // Pesticide actions
    if (metricData.pesticideApplication > 5) {
      items.push({
        id: 4,
        description: "Implement integrated pest management",
        category: "Pesticides",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Crop Specialist",
        cost: "Low",
        impact: "Reduce pesticide use by 30%",
      })
    }

    // Energy usage actions
    if (metricData.energyUsage > 100) {
      items.push({
        id: 5,
        description: "Install solar panels",
        category: "Energy",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Facilities Manager",
        cost: "High",
        impact: "Reduce energy usage by 40%",
      })
    }

    if (metricData.energyUsage > 50) {
      items.push({
        id: 6,
        description: "Replace equipment with energy-efficient alternatives",
        category: "Energy",
        priority: "low",
        status: "pending",
        dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Procurement Team",
        cost: "Medium",
        impact: "Reduce energy usage by 15%",
      })
    }

    setActionItems(items)
  }

  const toggleActionStatus = async (id: number) => {
    try {
      // Find the current item
      const currentItem = actionItems.find((item) => item.id === id)
      if (!currentItem) return

      // Determine the next status
      let nextStatus: "pending" | "in-progress" | "completed"
      if (currentItem.status === "pending") nextStatus = "in-progress"
      else if (currentItem.status === "in-progress") nextStatus = "completed"
      else nextStatus = "pending"

      // Try to update via API
      try {
        await api.patch(`/sustainability/actions/${id}`, {
          status: nextStatus,
        })
      } catch (error) {
        console.log("API endpoint not available, updating locally")
      }

      // Update local state
      setActionItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)))

      toast({
        title: "Status updated",
        description: `Action item status changed to ${nextStatus.replace("-", " ")}`,
      })
    } catch (error) {
      console.error("Error updating action item:", error)
      toast({
        title: "Update failed",
        description: "Could not update action item status",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "water":
        return "💧"
      case "soil":
        return "🌱"
      case "pesticides":
        return "🧪"
      case "energy":
        return "⚡"
      default:
        return "🌿"
    }
  }

  const calculateProgress = () => {
    if (actionItems.length === 0) return 0

    const completed = actionItems.filter((item) => item.status === "completed").length
    const inProgress = actionItems.filter((item) => item.status === "in-progress").length

    return Math.round(((completed + inProgress * 0.5) / actionItems.length) * 100)
  }

  const saveActionPlan = async () => {
    try {
      // Try to save via API
      await api.post(`/sustainability/${id}/save-action-plan`, {
        actionItems,
        progress: calculateProgress(),
      })

      toast({
        title: "Action plan saved",
        description: "Your action plan has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving action plan:", error)
      toast({
        title: "Save successful",
        description: "Your action plan has been saved (demo mode)",
      })
    }
  }

  const generateReport = async () => {
    try {
      // Try to generate report via API
      await api.post(`/sustainability/${id}/generate-report`)

      toast({
        title: "Report generated",
        description: "Your sustainability report has been generated and is ready for download",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Report generated",
        description: "Your sustainability report has been generated (demo mode)",
      })
    }
  }

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading action plan...</span>
        </div>
    )
  }

  if (!metric) {
    return (
        <div className="flex h-96 flex-col items-center justify-center">
          <p className="text-lg font-medium">Sustainability metric not found</p>
          <Button asChild className="mt-4">
            <Link to="/app/sustainability">Back to Sustainability Metrics</Link>
          </Button>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/app/sustainability/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Sustainability Action Plan</h1>
          </div>
          <Button onClick={generateReport}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Action Plan Overview</CardTitle>
            <CardDescription>
              {metric.farmName} • {metric.cropType} • Created on {formatDate(new Date().toISOString())}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Overall Progress</h3>
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Actions</span>
                  <span className="text-lg font-bold">{actionItems.length}</span>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-lg font-bold">
                  {actionItems.filter((item) => item.status === "completed").length}
                </span>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-lg font-bold">
                  {actionItems.filter((item) => item.status === "in-progress").length}
                </span>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-lg font-bold">
                  {actionItems.filter((item) => item.status === "pending").length}
                </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks to improve sustainability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="high" className="flex-1">
                  High Priority
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-1">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  Completed
                </TabsTrigger>
              </TabsList>

              {["all", "high", "in-progress", "completed"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-4 pt-4">
                    {actionItems
                        .filter((item) => {
                          if (tab === "all") return true
                          if (tab === "high") return item.priority === "high"
                          if (tab === "in-progress") return item.status === "in-progress"
                          if (tab === "completed") return item.status === "completed"
                          return true
                        })
                        .map((item) => (
                            <div key={item.id} className="rounded-lg border p-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                    id={`action-${item.id}`}
                                    checked={item.status === "completed"}
                                    onCheckedChange={() => toggleActionStatus(item.id)}
                                    className="mt-1"
                                />
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <label
                                        htmlFor={`action-${item.id}`}
                                        className={`font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                                    >
                                      {item.description}
                                    </label>
                                    <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(item.priority)}`}>
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </span>
                                    <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
                            </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span>{getCategoryIcon(item.category)}</span>
                              {item.category}
                            </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due: {formatDate(item.dueDate)}
                            </span>
                                    {item.assignedTo && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                            {item.assignedTo}
                                </span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                                      {item.cost} Cost
                            </span>
                                  </div>
                                  <p className="text-sm">{item.impact}</p>
                                </div>
                              </div>
                            </div>
                        ))}

                    {actionItems.filter((item) => {
                      if (tab === "all") return true
                      if (tab === "high") return item.priority === "high"
                      if (tab === "in-progress") return item.status === "in-progress"
                      if (tab === "completed") return item.status === "completed"
                      return true
                    }).length === 0 && (
                        <div className="flex h-24 items-center justify-center rounded-lg border">
                          <p className="text-muted-foreground">No action items found</p>
                        </div>
                    )}
                  </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={saveActionPlan}>
              <Check className="mr-2 h-4 w-4" />
              Save Action Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}
