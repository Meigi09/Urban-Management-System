"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {farmApi} from "@/lib/api.ts";

const farmSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  size: z.string().min(1, { message: "Size is required" }),
  description: z.string().optional(),
})

type FarmFormValues = z.infer<typeof farmSchema>

interface FarmFormProps {
  farm?: any
  isEditing?: boolean
}

export function FarmForm({ farm, isEditing = false }: FarmFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<FarmFormValues> = {
    name: farm?.name || "",
    location: farm?.location || "",
    size: farm?.size ? String(farm.size) : "",
    description: farm?.description || "",
  }

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues,
  })

  async function onSubmit(data: FarmFormValues) {
    setIsSubmitting(true)
    try {
      const farmData = {
        ...data,
        size: Number.parseFloat(data.size),
      }

      if (isEditing && farm?.id) {
        await farmApi.update(farm.id, farmData)
        toast({
          title: "Farm updated",
          description: "Farm has been updated successfully",
        })
      } else {
        await farmApi.create(farmData)
        toast({
          title: "Farm created",
          description: "Farm has been created successfully",
        })
      }
      navigate("/farms")
    } catch (error) {
      console.error("Error saving farm:", error)
      toast({
        title: "Error",
        description: "Failed to save farm",
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
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (acres)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Farm size in acres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Farm description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/farms")}>
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
