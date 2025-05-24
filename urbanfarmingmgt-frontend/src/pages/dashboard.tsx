"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Leaf, Droplets, Bug, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, User, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRoleAuth } from "@/hooks/use-role-auth"
import { RoleGuard, AdminOnly, ManagerOnly } from "@/components/role-guard"
import { dashboardApi } from "@/services/api-integration"
import { predictYield, predictWaterUsage, predictPestRisk, predictMarketPrice } from "@/services/prediction-service"

// Define types for our dashboard data
interface DashboardStats {
  totalFarms: number
  totalCrops: number
  totalHarvests: number
  totalInventory: number
  totalOrders: number
  totalRevenue: number
  totalClients: number
  totalStaff: number
}

interface PredictionData {
  cropYield: number
  waterUsage: number
  pestRisk: number
  marketPrice: number
}

// Helper function to get current season
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1 // getMonth() returns 0-11
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "fall"
  return "winter"
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [predictions, setPredictions] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const { user, role, hasPermission } = useRoleAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch real data from backend
        const stats = await dashboardApi.getStats()
        setStats(stats)

        // Generate predictions using our AI service with current season
        const currentSeason = getCurrentSeason()
        const predictionData = {
          cropYield: predictYield({
            cropType: "tomato",
            soilType: "loam",
            waterAmount: 5.2,
            temperature: 22,
            sunlightHours: 7,
            fieldSize: 100,
          }),
          waterUsage: predictWaterUsage({
            cropType: "tomato",
            fieldSize: 100,
            soilType: "loam",
            temperature: 22,
            rainfall: 15,
            season: currentSeason,
          }),
          pestRisk: predictPestRisk({
            cropType: "tomato",
            temperature: 22,
            humidity: 65,
            season: currentSeason,
            previousInfestation: false,
            neighboringCrops: ["lettuce", "basil"],
          }),
          marketPrice: predictMarketPrice({
            cropType: "tomato",
            season: currentSeason,
            supplyLevel: "medium",
            demandLevel: "high",
            previousPrice: 2.45,
            organicStatus: true,
          }),
        }

        setPredictions(predictionData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please check your backend connection.",
          variant: "destructive",
        })

        // Set empty stats on error
        setStats({
          totalFarms: 0,
          totalCrops: 0,
          totalHarvests: 0,
          totalInventory: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalClients: 0,
          totalStaff: 0,
        })

        // Still generate predictions even if API fails
        const currentSeason = getCurrentSeason()
        const predictionData = {
          cropYield: predictYield({
            cropType: "tomato",
            soilType: "loam",
            waterAmount: 5.2,
            temperature: 22,
            sunlightHours: 7,
            fieldSize: 100,
          }),
          waterUsage: predictWaterUsage({
            cropType: "tomato",
            fieldSize: 100,
            soilType: "loam",
            temperature: 22,
            rainfall: 15,
            season: currentSeason,
          }),
          pestRisk: predictPestRisk({
            cropType: "tomato",
            temperature: 22,
            humidity: 65,
            season: currentSeason,
            previousInfestation: false,
            neighboringCrops: ["lettuce", "basil"],
          }),
          marketPrice: predictMarketPrice({
            cropType: "tomato",
            season: currentSeason,
            supplyLevel: "medium",
            demandLevel: "high",
            previousPrice: 2.45,
            organicStatus: true,
          }),
        }
        setPredictions(predictionData)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const handleRefresh = async () => {
    setIsRefreshing(true)

    // Generate new predictions with slight variations for demo
    const currentSeason = getCurrentSeason()
    const predictionData = {
      cropYield: predictYield({
        cropType: "tomato",
        soilType: "loam",
        waterAmount: 5.2 + (Math.random() - 0.5) * 0.5, // Slight variation
        temperature: 22 + (Math.random() - 0.5) * 2,
        sunlightHours: 7,
        fieldSize: 100,
      }),
      waterUsage: predictWaterUsage({
        cropType: "tomato",
        fieldSize: 100,
        soilType: "loam",
        temperature: 22 + (Math.random() - 0.5) * 2,
        rainfall: 15 + (Math.random() - 0.5) * 5,
        season: currentSeason,
      }),
      pestRisk: predictPestRisk({
        cropType: "tomato",
        temperature: 22 + (Math.random() - 0.5) * 2,
        humidity: 65 + (Math.random() - 0.5) * 10,
        season: currentSeason,
        previousInfestation: false,
        neighboringCrops: ["lettuce", "basil"],
      }),
      marketPrice: predictMarketPrice({
        cropType: "tomato",
        season: currentSeason,
        supplyLevel: "medium",
        demandLevel: "high",
        previousPrice: 2.45 + (Math.random() - 0.5) * 0.3,
        organicStatus: true,
      }),
    }

    setPredictions(predictionData)

    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Dashboard Updated",
        description: "AI predictions have been refreshed with latest data",
      })
    }, 1000)
  }

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.username || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Urban Farming Management System • {role} Dashboard
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                System Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Updating...' : 'Refresh AI'}
            </Button>
            <AdminOnly>
              <Button>
                <BarChart className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </AdminOnly>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFarms}</div>
              <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +2 from last month
              </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCrops}</div>
              <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +5 from last month
              </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +12 from last month
              </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +8% from last month
              </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Summary Section */}
        <AdminOnly>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Business Summary
              </CardTitle>
              <CardDescription>
                Key performance indicators and business metrics overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Growth</span>
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Efficiency Score</span>
                    <span className="text-sm text-blue-600">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sustainability Index</span>
                    <span className="text-sm text-green-600">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </AdminOnly>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <RoleGuard requiredPermission="canViewReports">
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </RoleGuard>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Harvests</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalHarvests}</div>
                  <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +24 from last month
                  </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalInventory}</div>
                  <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +120 from last month
                  </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Clients</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalClients}</div>
                  <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +3 from last month
                  </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Staff</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalStaff}</div>
                  <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    -2 from last month
                  </span>
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Harvests</CardTitle>
                  <CardDescription>Last 5 harvests across all farms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { crop: "Tomato", farm: "Farm #3", yield: "120 kg" },
                      { crop: "Lettuce", farm: "Farm #1", yield: "85 kg" },
                      { crop: "Carrot", farm: "Farm #2", yield: "95 kg" },
                      { crop: "Cucumber", farm: "Farm #4", yield: "110 kg" },
                      { crop: "Spinach", farm: "Farm #1", yield: "65 kg" },
                    ].map((harvest, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-primary" />
                          </div>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{harvest.crop} Harvest - {harvest.farm}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Date.now() - (i + 1) * 86400000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-auto font-medium">{harvest.yield}</div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Last 5 customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Order #{1000 + i}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-auto font-medium">${(250 + i * 150).toFixed(2)}</div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="predictions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Predicted Yield</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions?.cropYield} kg</div>
                  <p className="text-xs text-muted-foreground">For tomatoes in current conditions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions?.waterUsage} L</div>
                  <p className="text-xs text-muted-foreground">Estimated daily requirement</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pest Risk</CardTitle>
                  <Bug className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions?.pestRisk}%</div>
                  <p className="text-xs text-muted-foreground">
                    {predictions && predictions.pestRisk > 50 ? "High risk - take action" : "Moderate risk - monitor"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Market Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${predictions?.marketPrice}/kg</div>
                  <p className="text-xs text-muted-foreground">Predicted market value</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>AI Prediction Insights</CardTitle>
                <CardDescription>Leveraging machine learning to optimize your farming operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Yield Optimization</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on current soil conditions and weather patterns, our AI predicts a yield of{" "}
                      {predictions?.cropYield} kg for your tomato crop. To optimize yield, consider increasing water by
                      10% and applying organic fertilizer within the next 7 days.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Pest Management Alert</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      There is a {predictions?.pestRisk}% risk of pest infestation in the coming weeks. Preventative
                      measures are recommended, including introducing beneficial insects and applying organic pest
                      deterrents.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Market Timing Recommendation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current market price prediction is ${predictions?.marketPrice}/kg. Based on historical trends,
                      prices are expected to increase by 8-12% in the next 3 weeks. Consider timing your harvest
                      accordingly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Performance Analytics</CardTitle>
                  <CardDescription>Comparative analysis across all farms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg">
                    <p className="text-muted-foreground">Interactive charts and analytics would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>Water, energy, and soil usage trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Water Usage Efficiency</span>
                      <Badge variant="outline">+15% vs last month</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Energy Consumption</span>
                      <Badge variant="outline">-8% vs last month</Badge>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Soil Health Index</span>
                      <Badge variant="outline">+5% vs last month</Badge>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <RoleGuard requiredPermission="canViewReports">
            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>Revenue, costs, and profitability analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Monthly Revenue</p>
                          <p className="text-sm text-muted-foreground">Current month performance</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">$125,000</p>
                          <p className="text-xs text-green-600">+12% ↗</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Operating Costs</p>
                          <p className="text-sm text-muted-foreground">Monthly expenses</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">$78,500</p>
                          <p className="text-xs text-red-600">+3% ↗</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Net Profit</p>
                          <p className="text-sm text-muted-foreground">Monthly profit margin</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">$46,500</p>
                          <p className="text-xs text-green-600">+18% ↗</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Reports</CardTitle>
                    <CardDescription>Environmental impact and sustainability metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Carbon Footprint Reduced</p>
                          <p className="text-sm text-muted-foreground">25% reduction this quarter</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">Water Conservation</p>
                          <p className="text-sm text-muted-foreground">Target: 30% reduction</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Organic Certification</p>
                          <p className="text-sm text-muted-foreground">85% of farms certified</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </RoleGuard>
        </Tabs>
      </div>
  )
}


