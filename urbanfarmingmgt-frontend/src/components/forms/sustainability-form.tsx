import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { sustainabilityApi, farmApi, cropApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const sustainabilitySchema = z.object({
  waterUsage: z.string().min(1, { message: "Water usage is required" }),
  soilHealth: z.string().min(1, { message: "Soil health is required" }),
  pesticideApplication: z.string().min(1, { message: "Pesticide application is required" }),
  energyUsage: z.string().min(1, { message: "Energy usage is required" }),
  farmId: z.string().optional(),
  cropId: z.string().optional(),
  notes: z.string().optional(),
})

type SustainabilityFormValues = z.infer<typeof sustainabilitySchema>

interface SustainabilityFormProps {
  metric?: any
  isEditing?: boolean
}

export function SustainabilityForm({ metric, isEditing = false }: SustainabilityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [farms, setFarms] = useState<any[]>([])
  const [crops, setCrops] = useState<any[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmsResponse, cropsResponse] = await Promise.all([farmApi.getAll(), cropApi.getAll()])
        setFarms(farmsResponse.data)
        setCrops(cropsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const defaultValues: Partial<SustainabilityFormValues> = {
    waterUsage: metric?.waterUsage ? String(metric.waterUsage) : "",
    soilHealth: metric?.soilHealth ? String(metric.soilHealth) : "",
    pesticideApplication: metric?.pesticideApplication ? String(metric.pesticideApplication) : "",
    energyUsage: metric?.energyUsage ? String(metric.energyUsage) : "",
    farmId: metric?.farmId ? String(metric.farmId) : "",
    cropId: metric?.cropId ? String(metric.cropId) : "",
    notes: metric?.notes || "",
  }

  const form = useForm<SustainabilityFormValues>({
    resolver: zodResolver(sustainabilitySchema),
    defaultValues,
  })

  async function onSubmit(data: SustainabilityFormValues) {
    setIsSubmitting(true)
    try {
      const metricData = {
        ...data,
        waterUsage: Number.parseFloat(data.waterUsage),
        soilHealth: Number.parseFloat(data.soilHealth),
        pesticideApplication: Number.parseFloat(data.pesticideApplication),
        energyUsage: Number.parseFloat(data.energyUsage),
        farmId: data.farmId ? Number.parseInt(data.farmId) : undefined,
        cropId: data.cropId ? Number.parseInt(data.cropId) : undefined,
      }

      if (isEditing && metric?.id) {
        await sustainabilityApi.update(metric.id, metricData)
        toast({
          title: "Sustainability metric updated",
          description: "Sustainability metric has been updated successfully",
        })
      } else {
        await sustainabilityApi.create(metricData)

        // If crop is selected, record metrics for crop
        if (data.cropId) {
          await cropApi.recordMetrics(
            Number.parseInt(data.cropId),
            metricData.waterUsage,
            metricData.soilHealth,
            metricData.pesticideApplication,
            metricData.energyUsage,
          )
        }

        // If farm is selected, track metrics for farm
        if (data.farmId && data.cropId) {
          // Assuming the metric ID is returned in the response
          const response = await sustainabilityApi.getAll()
          const newMetric = response.data[response.data.length - 1]
          if (newMetric && newMetric.id) {
            await farmApi.trackMetrics(Number.parseInt(data.farmId), newMetric.id)
          }
        }

        toast({
          title: "Sustainability metric created",
          description: "Sustainability metric has been created successfully",
        })
      }
      navigate("/sustainability")
    } catch (error) {
      console.error("Error saving sustainability metric:", error)
      toast({
        title: "Error",
        description: "Failed to save sustainability metric",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Sustainability Metric" : "Add New Sustainability Metric"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="waterUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Usage (liters)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Water usage in liters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilHealth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Health (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="1" max="10" placeholder="Soil health rating" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pesticideApplication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesticide Application (kg/hectare)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Pesticide application" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="energyUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Usage (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Energy usage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {farms.map((farm) => (
                        <SelectItem key={farm.id || farm.farmID} value={String(farm.id || farm.farmID)}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cropId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crop" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop.id || crop.cropID} value={String(crop.id || crop.cropID)}>
                          {crop.cropType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/sustainability")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Metric" : "Add Metric"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
