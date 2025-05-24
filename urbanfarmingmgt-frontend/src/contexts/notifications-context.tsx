"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  category: 'system' | 'farm' | 'crop' | 'order' | 'inventory' | 'staff'
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notifications")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
        } catch {
          return []
        }
      }
    }
    return []
  })

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  // Add some sample notifications on first load
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
        {
          title: "Welcome to Urban Farming!",
          message: "Your account has been successfully created. Start managing your farms today.",
          type: "success",
          category: "system",
          actionUrl: "/dashboard",
          actionLabel: "Go to Dashboard"
        },
        {
          title: "Harvest Ready",
          message: "Tomatoes at Green Valley Farm are ready for harvest.",
          type: "info",
          category: "crop",
          actionUrl: "/crops",
          actionLabel: "View Crops"
        },
        {
          title: "Low Inventory Alert",
          message: "Lettuce stock is running low. Only 5 units remaining.",
          type: "warning",
          category: "inventory",
          actionUrl: "/inventory",
          actionLabel: "Check Inventory"
        },
        {
          title: "New Order Received",
          message: "Order #1234 from Green Market has been placed.",
          type: "info",
          category: "order",
          actionUrl: "/orders",
          actionLabel: "View Orders"
        },
        {
          title: "Staff Schedule Update",
          message: "John Smith's schedule has been updated for next week.",
          type: "info",
          category: "staff",
          actionUrl: "/staff",
          actionLabel: "View Staff"
        }
      ]

      sampleNotifications.forEach(notification => {
        addNotification(notification)
      })
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
