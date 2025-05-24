"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { farmApi } from "@/services/api-integration"
import type { Farm, FarmFormData } from "@/types/models"

const farmSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  totalPlantingArea: z.number().min(0.1, { message: "Total planting area must be greater than 0" }),
})

type FarmFormValues = z.infer<typeof farmSchema>

interface FarmFormProps {
  farm?: Farm
  isEditing?: boolean
}

export function FarmForm({ farm, isEditing = false }: FarmFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<FarmFormValues> = {
    name: farm?.name || "",
    location: farm?.location || "",
    totalPlantingArea: farm?.totalPlantingArea || 0,
  }

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues,
  })

  async function onSubmit(data: FarmFormValues) {
    setIsSubmitting(true)
    try {
      const farmData: FarmFormData = {
        name: data.name,
        location: data.location,
        totalPlantingArea: data.totalPlantingArea,
      }

      if (isEditing && farm?.farmID) {
        const response = await farmApi.update(farm.farmID, farmData)
        toast({
          title: "Farm updated",
          description: response || "Farm has been updated successfully",
        })
      } else {
        const response = await farmApi.create(farmData)
        toast({
          title: "Farm created",
          description: response || "Farm has been created successfully",
        })

        // Trigger refresh event for farms list
        window.dispatchEvent(new CustomEvent('farmCreated'))
      }
      navigate("/farms")
    } catch (error) {
      console.error("Error saving farm:", error)
      toast({
        title: "Error",
        description: "Failed to save farm. Please check your data and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Farm" : "Add New Farm"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Farm name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Farm location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPlantingArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Planting Area (hectares)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Total planting area in hectares"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/farms")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Farm" : "Create Farm"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
