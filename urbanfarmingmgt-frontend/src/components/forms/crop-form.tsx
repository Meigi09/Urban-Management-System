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
import {cropApi , farmApi} from "@/lib/api.ts";

const cropSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type must be at least 2 characters" }),
  plantingSchedule: z.string().min(1, { message: "Planting schedule is required" }),
  growingConditions: z.boolean().default(true),
  locationRequirement: z.string().min(2, { message: "Location requirement must be at least 2 characters" }),
  growingSeason: z.string().min(2, { message: "Growing season must be at least 2 characters" }),
  farmId: z.string().optional(),
})

type CropFormValues = z.infer<typeof cropSchema>

interface CropFormProps {
  crop?: any
  isEditing?: boolean
}

export function CropForm({ crop, isEditing = false }: CropFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [farms, setFarms] = useState<any[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await farmApi.getAll()
        setFarms(response.data)
      } catch (error) {
        console.error("Error fetching farms:", error)
        toast({
          title: "Error",
          description: "Failed to load farms",
          variant: "destructive",
        })
      }
    }

    fetchFarms()
  }, [toast])

  const defaultValues: Partial<CropFormValues> = {
    cropType: crop?.cropType || "",
    plantingSchedule: crop?.plantingSchedule ? new Date(crop.plantingSchedule).toISOString().split("T")[0] : "",
    growingConditions: crop?.growingConditions || true,
    locationRequirement: crop?.locationRequirement || "",
    growingSeason: crop?.growingSeason || "",
    farmId: crop?.farmId ? String(crop.farmId) : undefined,
  }

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues,
  })

  async function onSubmit(data: CropFormValues) {
    setIsSubmitting(true)
    try {
      const cropData = {
        ...data,
        plantingSchedule: new Date(data.plantingSchedule).toISOString(),
        farmId: data.farmId ? Number.parseInt(data.farmId) : undefined,
      }

      if (isEditing && crop?.id) {
        await cropApi.update(crop.id, cropData)
        toast({
          title: "Crop updated",
          description: "Crop has been updated successfully",
        })
      } else {
        const response = await cropApi.create(cropData)

        // If farm is selected, assign crop to farm
        if (data.farmId) {
          const cropId = response.data.id || response.data.cropID
          await cropApi.assignToFarm(cropId, Number.parseInt(data.farmId))
        }

        toast({
          title: "Crop created",
          description: "Crop has been created successfully",
        })
      }
      navigate("/crops")
    } catch (error) {
      console.error("Error saving crop:", error)
      toast({
        title: "Error",
        description: "Failed to save crop",
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
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Farm (Optional)</FormLabel>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/crops")}>
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
