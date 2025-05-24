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
import { Checkbox } from "@/components/ui/checkbox"
import { inventoryApi } from "@/services/api-integration"
import { useToast } from "@/hooks/use-toast"
import type { Inventory, InventoryFormData } from "@/types/models"

const inventorySchema = z.object({
  quantity: z.number().min(0, { message: "Quantity must be 0 or greater" }),
  freshnessStatus: z.boolean().default(true),
  storageLocation: z.string().min(2, { message: "Storage location must be at least 2 characters" }),
  stock: z.number().min(0, { message: "Stock must be 0 or greater" }),
  produceType: z.string().min(2, { message: "Produce type must be at least 2 characters" }),
})

type InventoryFormValues = z.infer<typeof inventorySchema>

interface InventoryFormProps {
  inventory?: Inventory
  isEditing?: boolean
}

export function InventoryForm({ inventory, isEditing = false }: InventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<InventoryFormValues> = {
    quantity: inventory?.quantity || 0,
    freshnessStatus: inventory?.freshnessStatus ?? true,
    storageLocation: inventory?.storageLocation || "",
    stock: inventory?.stock || 0,
    produceType: inventory?.produceType || "",
  }

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues,
  })

  async function onSubmit(data: InventoryFormValues) {
    setIsSubmitting(true)
    try {
      const inventoryData: InventoryFormData = {
        quantity: data.quantity,
        freshnessStatus: data.freshnessStatus,
        storageLocation: data.storageLocation,
        stock: data.stock,
        produceType: data.produceType,
      }

      if (isEditing && inventory?.inventoryID) {
        const response = await inventoryApi.update(inventory.inventoryID, inventoryData)
        toast({
          title: "Inventory updated",
          description: "Inventory item has been updated successfully",
        })
      } else {
        const response = await inventoryApi.create(inventoryData)
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
        description: "Failed to save inventory item. Please check your data and try again.",
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
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Quantity"
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
                name="stock"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Stock count"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
              name="freshnessStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Fresh Status
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check if the produce is fresh
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/app/inventory")}>
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
