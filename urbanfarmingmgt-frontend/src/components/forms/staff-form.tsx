"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { staffApi, farmApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  contactInfo: z.string().min(5, { message: "Contact info must be at least 5 characters" }),
  isVolunteer: z.boolean().default(false),
  workHours: z.string().min(1, { message: "Work hours is required" }),
  tasks: z.string().optional(),
  farmId: z.string().optional(),
})

type StaffFormValues = z.infer<typeof staffSchema>

interface StaffFormProps {
  staff?: any
  isEditing?: boolean
}

export function StaffForm({ staff, isEditing = false }: StaffFormProps) {
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

  const defaultValues: Partial<StaffFormValues> = {
    name: staff?.name || "",
    role: staff?.role || "",
    contactInfo: staff?.contactInfo || "",
    isVolunteer: staff?.isVolunteer || false,
    workHours: staff?.workHours ? String(staff.workHours) : "",
    tasks: staff?.tasks || "",
    farmId: staff?.farmId ? String(staff.farmId) : "",
  }

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues,
  })

  async function onSubmit(data: StaffFormValues) {
    setIsSubmitting(true)
    try {
      const staffData = {
        ...data,
        workHours: Number.parseFloat(data.workHours),
        farmId: data.farmId ? Number.parseInt(data.farmId) : undefined,
      }

      if (isEditing && staff?.id) {
        await staffApi.update(staff.id, staffData)

        // Update work hours if changed
        if (staffData.workHours !== staff.workHours) {
          await staffApi.updateWorkHours(staff.id, staffData.workHours)
        }

        // Assign task if provided
        if (staffData.tasks && staffData.tasks !== staff.tasks) {
          await staffApi.assignTask(staff.id, staffData.tasks)
        }

        // Assign to farm if changed
        if (data.farmId && data.farmId !== String(staff.farmId)) {
          await staffApi.assignToFarm(staff.id, Number.parseInt(data.farmId))
        }

        toast({
          title: "Staff updated",
          description: "Staff member has been updated successfully",
        })
      } else {
        const response = await staffApi.create(staffData)

        // Assign to farm if selected
        if (data.farmId && response.data && response.data.id) {
          await staffApi.assignToFarm(response.data.id, Number.parseInt(data.farmId))
        }

        // Assign task if provided
        if (staffData.tasks && response.data && response.data.id) {
          await staffApi.assignTask(response.data.id, staffData.tasks)
        }

        toast({
          title: "Staff created",
          description: "Staff member has been created successfully",
        })
      }
      navigate("/staff")
    } catch (error) {
      console.error("Error saving staff:", error)
      toast({
        title: "Error",
        description: "Failed to save staff member",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Staff Member" : "Add New Staff Member"}</CardTitle>
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
                    <Input placeholder="Staff name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FARM_MANAGER">Farm Manager</SelectItem>
                      <SelectItem value="FARM_WORKER">Farm Worker</SelectItem>
                      <SelectItem value="HARVESTER">Harvester</SelectItem>
                      <SelectItem value="INVENTORY_MANAGER">Inventory Manager</SelectItem>
                      <SelectItem value="DELIVERY_STAFF">Delivery Staff</SelectItem>
                      <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="isVolunteer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Volunteer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Hours (per week)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.5" placeholder="Work hours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Assigned tasks" {...field} />
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
            <Button variant="outline" type="button" onClick={() => navigate("/staff")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Staff" : "Add Staff"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
