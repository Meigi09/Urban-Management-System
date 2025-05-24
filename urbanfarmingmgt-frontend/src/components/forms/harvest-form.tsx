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
import { harvestApi, cropApi, inventoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const harvestSchema = z.object({
  cropId: z.string().min(1, { message: "Crop is required" }),
  yield: z.string().min(1, { message: "Yield is required" }),
  harvestDate: z.string().min(1, { message: "Harvest date is required" }),
  qualityRating: z.string().min(1, { message: "Quality rating is required" }),
  inventoryId: z.string().optional(),
})

type HarvestFormValues = z.infer<typeof harvestSchema>

interface HarvestFormProps {
  harvest?: any
  isEditing?: boolean
}

export function HarvestForm({ harvest, isEditing = false }: HarvestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [crops, setCrops] = useState<any[]>([])
  const [inventories, setInventories] = useState<any[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsResponse, inventoriesResponse] = await Promise.all([cropApi.getAll(), inventoryApi.getAll()])
        setCrops(cropsResponse.data)
        setInventories(inventoriesResponse.data)
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

  const defaultValues: Partial<HarvestFormValues> = {
    cropId: harvest?.cropId ? String(harvest.cropId) : "",
    yield: harvest?.yield ? String(harvest.yield) : "",
    harvestDate: harvest?.harvestDate ? new Date(harvest.harvestDate).toISOString().split("T")[0] : "",
    qualityRating: harvest?.qualityRating ? String(harvest.qualityRating) : "",
    inventoryId: harvest?.inventoryId ? String(harvest.inventoryId) : "",
  }

  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues,
  })

  async function onSubmit(data: HarvestFormValues) {
    setIsSubmitting(true)
    try {
      const harvestData = {
        cropId: Number.parseInt(data.cropId),
        yield: Number.parseFloat(data.yield),
        harvestDate: new Date(data.harvestDate).toISOString(),
        qualityRating: Number.parseInt(data.qualityRating),
        inventoryId: data.inventoryId ? Number.parseInt(data.inventoryId) : undefined,
      }

      if (isEditing && harvest?.id) {
        await harvestApi.update(harvest.id, harvestData)

        // Update quality rating if changed
        if (harvestData.qualityRating !== harvest.qualityRating) {
          await harvestApi.updateQuality(harvest.id, harvestData.qualityRating)
        }

        // Update yield if changed
        if (harvestData.yield !== harvest.yield) {
          await harvestApi.updateYield(harvest.id, harvestData.yield)
        }

        // Transfer to inventory if changed
        if (data.inventoryId && data.inventoryId !== String(harvest.inventoryId)) {
          await harvestApi.transferToInventory(harvest.id, Number.parseInt(data.inventoryId))
        }

        toast({
          title: "Harvest updated",
          description: "Harvest has been updated successfully",
        })
      } else {
        // Create harvest through crop API
        const response = await cropApi.recordHarvest(harvestData.cropId, harvestData.yield, harvestData.qualityRating)

        // If inventory is selected, transfer harvest to inventory
        if (data.inventoryId && response.data && response.data.id) {
          await harvestApi.transferToInventory(response.data.id, Number.parseInt(data.inventoryId))

          // Update inventory with harvest yield
          await inventoryApi.trackHarvest(response.data.id, harvestData.yield)
        }

        toast({
          title: "Harvest recorded",
          description: "Harvest has been recorded successfully",
        })
      }
      navigate("/harvests")
    } catch (error) {
      console.error("Error saving harvest:", error)
      toast({
        title: "Error",
        description: "Failed to save harvest",
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
            <Button variant="outline" type="button" onClick={() => navigate("/harvests")}>
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
