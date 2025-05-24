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
import { inventoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const inventorySchema = z.object({
  produceType: z.string().min(2, { message: "Produce type must be at least 2 characters" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  storageLocation: z.string().min(2, { message: "Storage location must be at least 2 characters" }),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
})

type InventoryFormValues = z.infer<typeof inventorySchema>

interface InventoryFormProps {
  inventory?: any
  isEditing?: boolean
}

export function InventoryForm({ inventory, isEditing = false }: InventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<InventoryFormValues> = {
    produceType: inventory?.produceType || "",
    quantity: inventory?.quantity ? String(inventory.quantity) : "",
    unit: inventory?.unit || "kg",
    storageLocation: inventory?.storageLocation || "",
    expiryDate: inventory?.expiryDate ? new Date(inventory.expiryDate).toISOString().split("T")[0] : "",
    notes: inventory?.notes || "",
  }

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues,
  })

  async function onSubmit(data: InventoryFormValues) {
    setIsSubmitting(true)
    try {
      const inventoryData = {
        ...data,
        quantity: Number.parseFloat(data.quantity),
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
      }

      if (isEditing && inventory?.id) {
        await inventoryApi.update(inventory.id, inventoryData)
        toast({
          title: "Inventory updated",
          description: "Inventory item has been updated successfully",
        })
      } else {
        await inventoryApi.create(inventoryData)
        toast({
          title: "Inventory created",
          description: "Inventory item has been created successfully",
        })
      }
      navigate("/inventory")
    } catch (error) {
      console.error("Error saving inventory:", error)
      toast({
        title: "Error",
        description: "Failed to save inventory item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="produceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produce Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Produce type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit (e.g., kg, lb)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Storage location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
            <Button variant="outline" type="button" onClick={() => navigate("/inventory")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
