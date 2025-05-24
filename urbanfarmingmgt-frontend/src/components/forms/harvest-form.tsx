import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { harvestApi, cropApi, farmApi, inventoryApi } from "@/services/api-integration"
import { useToast } from "@/hooks/use-toast"
import type { Harvest, HarvestFormData, Crop, Farm, Inventory } from "@/types/models"

const harvestSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  yield: z.number().min(0, { message: "Yield must be 0 or greater" }),
  qualityRating: z.number().min(1).max(10, { message: "Quality rating must be between 1 and 10" }),
  cropID: z.number().min(1, { message: "Crop is required" }),
  farmID: z.number().min(1, { message: "Farm is required" }),
  inventoryID: z.number().min(1, { message: "Inventory is required" }),
})

type HarvestFormValues = z.infer<typeof harvestSchema>

interface HarvestFormProps {
  harvest?: Harvest
  isEditing?: boolean
}

export function HarvestForm({ harvest, isEditing = false }: HarvestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [crops, setCrops] = useState<Crop[]>([])
  const [farms, setFarms] = useState<Farm[]>([])
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [cropsData, farmsData, inventoryData] = await Promise.all([
          cropApi.getAll(),
          farmApi.getAll(),
          inventoryApi.getAll()
        ])
        setCrops(cropsData)
        setFarms(farmsData)
        setInventory(inventoryData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load required data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const defaultValues: Partial<HarvestFormValues> = {
    date: harvest?.date ? new Date(harvest.date).toISOString().split("T")[0] : "",
    yield: harvest?.yield || 0,
    qualityRating: harvest?.qualityRating || 5,
    cropID: harvest?.crop?.cropID || 0,
    farmID: harvest?.farm?.farmID || 0,
    inventoryID: harvest?.inventory?.inventoryID || 0,
  }

  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues,
  })

  async function onSubmit(data: HarvestFormValues) {
    setIsSubmitting(true)
    try {
      const harvestData: HarvestFormData = {
        date: new Date(data.date).toISOString(),
        yield: data.yield,
        qualityRating: data.qualityRating,
        cropID: data.cropID,
        farmID: data.farmID,
        inventoryID: data.inventoryID,
      }

      if (isEditing && harvest?.harvestID) {
        const response = await harvestApi.update(harvest.harvestID, harvestData)
        toast({
          title: "Harvest updated",
          description: response || "Harvest has been updated successfully",
        })
      } else {
        const response = await harvestApi.create(harvestData)
        toast({
          title: "Harvest created",
          description: response || "Harvest has been created successfully",
        })
      }
      navigate("/harvests")
    } catch (error) {
      console.error("Error saving harvest:", error)
      toast({
        title: "Error",
        description: "Failed to save harvest. Please check your data and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Harvest" : "Record New Harvest"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cropId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop</FormLabel>
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
              name="yield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yield (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Harvest yield in kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harvestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harvest Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualityRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Rating (1-10)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <SelectItem key={rating} value={String(rating)}>
                          {rating}
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
              name="inventoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add to Inventory (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inventory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventories.map((inventory) => (
                        <SelectItem key={inventory.id} value={String(inventory.id)}>
                          {inventory.produceType || inventory.name}
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
            <Button variant="outline" type="button" onClick={() => navigate("/app/harvests")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Harvest" : "Record Harvest"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
