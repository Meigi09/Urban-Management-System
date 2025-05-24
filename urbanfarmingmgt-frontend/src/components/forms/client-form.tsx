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
import {clientApi} from "@/lib/api.ts";

const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contactInfo: z.string().min(5, { message: "Contact info must be at least 5 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  orderPreferences: z.string().optional(),
  paymentHistory: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: any
  isEditing?: boolean
}

export function ClientForm({ client, isEditing = false }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const defaultValues: Partial<ClientFormValues> = {
    name: client?.name || "",
    contactInfo: client?.contactInfo || "",
    address: client?.address || "",
    orderPreferences: client?.orderPreferences || "",
    paymentHistory: client?.paymentHistory || "",
  }

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true)
    try {
      if (isEditing && client?.id) {
        await clientApi.update(client.id, data)
        toast({
          title: "Client updated",
          description: "Client has been updated successfully",
        })
      } else {
        await clientApi.create(data)
        toast({
          title: "Client created",
          description: "Client has been created successfully",
        })
      }
      navigate("/clients")
    } catch (error) {
      console.error("Error saving client:", error)
      toast({
        title: "Error",
        description: "Failed to save client",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Client" : "Add New Client"}</CardTitle>
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
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Client address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Client order preferences" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing && (
              <FormField
                control={form.control}
                name="paymentHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment history" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/clients")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
