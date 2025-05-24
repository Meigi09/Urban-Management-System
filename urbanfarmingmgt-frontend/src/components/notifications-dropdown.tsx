"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Sprout,
  Package,
  Users,
  ShoppingCart,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications, type Notification } from "@/contexts/notifications-context"
import { formatDistanceToNow } from "date-fns"

const getNotificationIcon = (category: string) => {
  switch (category) {
    case 'farm':
      return <Sprout className="h-4 w-4" />
    case 'crop':
      return <Sprout className="h-4 w-4" />
    case 'inventory':
      return <Package className="h-4 w-4" />
    case 'staff':
      return <Users className="h-4 w-4" />
    case 'order':
      return <ShoppingCart className="h-4 w-4" />
    case 'system':
      return <Settings className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <Info className="h-4 w-4 text-blue-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500'
    case 'warning':
      return 'border-l-yellow-500'
    case 'error':
      return 'border-l-red-500'
    default:
      return 'border-l-blue-500'
  }
}

export function NotificationsDropdown() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications()
  
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  const recentNotifications = notifications.slice(0, 10)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No notifications yet
          </div>
        ) : (
          <>
            <ScrollArea className="h-96">
              <div className="space-y-1">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 ${getTypeColor(notification.type)} ${
                      !notification.read ? 'bg-muted/50' : ''
                    } hover:bg-accent/50 transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          {getTypeIcon(notification.type)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                          <div className="flex items-center gap-1">
                            {notification.actionUrl && (
                              <Link to={notification.actionUrl}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  {notification.actionLabel || 'View'}
                                </Button>
                              </Link>
                            )}
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {notifications.length > 10 && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <span className="text-xs text-muted-foreground">
                    Showing 10 of {notifications.length} notifications
                  </span>
                </div>
              </>
            )}
            
            <DropdownMenuSeparator />
            <div className="p-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
