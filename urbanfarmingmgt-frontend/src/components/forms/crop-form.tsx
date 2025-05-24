import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { cropApi, farmApi, inventoryApi } from "@/services/api-integration"
import type { Crop, CropFormData, Farm, Inventory } from "@/types/models"

const cropSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type must be at least 2 characters" }),
  plantingSchedule: z.string().min(1, { message: "Planting schedule is required" }),
  growingConditions: z.boolean().default(true),
  averageYield: z.number().min(0, { message: "Average yield must be 0 or greater" }).optional(),
  growingSeason: z.string().min(2, { message: "Growing season must be at least 2 characters" }),
  locationRequirement: z.string().min(2, { message: "Location requirement must be at least 2 characters" }),
  farmID: z.number().min(1, { message: "Farm is required" }),
  inventoryID: z.number().min(1, { message: "Inventory is required" }),
})

type CropFormValues = z.infer<typeof cropSchema>

interface CropFormProps {
  crop?: Crop
  isEditing?: boolean
}

export function CropForm({ crop, isEditing = false }: CropFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [farms, setFarms] = useState<Farm[]>([])
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [farmsData, inventoryData] = await Promise.all([
          farmApi.getAll(),
          inventoryApi.getAll()
        ])
        setFarms(farmsData)
        setInventory(inventoryData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load farms and inventory data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const defaultValues: Partial<CropFormValues> = {
    cropType: crop?.cropType || "",
    plantingSchedule: crop?.plantingSchedule ? new Date(crop.plantingSchedule).toISOString().split("T")[0] : "",
    growingConditions: crop?.growingConditions ?? true,
    averageYield: crop?.averageYield || 0,
    growingSeason: crop?.growingSeason || "",
    locationRequirement: crop?.locationRequirement || "",
    farmID: crop?.farm?.farmID || 0,
    inventoryID: crop?.inventory?.inventoryID || 0,
  }

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues,
  })

  async function onSubmit(data: CropFormValues) {
    setIsSubmitting(true)
    try {
      const cropData: CropFormData = {
        cropType: data.cropType,
        plantingSchedule: new Date(data.plantingSchedule).toISOString(),
        growingConditions: data.growingConditions,
        averageYield: data.averageYield,
        growingSeason: data.growingSeason,
        locationRequirement: data.locationRequirement,
        farmID: data.farmID,
        inventoryID: data.inventoryID,
      }

      if (isEditing && crop?.cropID) {
        const response = await cropApi.update(crop.cropID, cropData)
        toast({
          title: "Crop updated",
          description: response || "Crop has been updated successfully",
        })
      } else {
        const response = await cropApi.create(cropData)
        toast({
          title: "Crop created",
          description: response || "Crop has been created successfully",
        })
      }
      navigate("/crops")
    } catch (error) {
      console.error("Error saving crop:", error)
      toast({
        title: "Error",
        description: "Failed to save crop. Please check your data and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Crop" : "Add New Crop"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Crop type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantingSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planting Schedule</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="growingConditions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Favorable Growing Conditions</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationRequirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Requirement</FormLabel>
                  <FormControl>
                    <Input placeholder="Location requirement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="growingSeason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Growing Season</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select growing season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                      <SelectItem value="Year-round">Year-round</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="averageYield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Yield (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Average yield"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="farmID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingData ? "Loading farms..." : "Select a farm"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {farms.map((farm) => (
                        <SelectItem key={farm.farmID} value={farm.farmID.toString()}>
                          {farm.name} - {farm.location}
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
              name="inventoryID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingData ? "Loading inventory..." : "Select inventory"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory.map((item) => (
                        <SelectItem key={item.inventoryID} value={item.inventoryID.toString()}>
                          {item.produceType} - {item.storageLocation} (Stock: {item.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/crops")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Crop" : "Create Crop"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
