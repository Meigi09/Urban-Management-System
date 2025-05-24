"use client"

import type React from "react"

import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Sprout,
  Leaf,
  ShoppingCart,
  Package,
  UserCog,
  BarChart3,
  Settings,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
  isActive?: boolean
}

function SidebarItem({ icon, title, href, isActive }: SidebarItemProps) {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-300",
          isActive && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        )}
      >
        {icon}
        <span>{title}</span>
      </Button>
    </Link>
  )
}

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"

  return (
    <aside className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Urban Farm Pro</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard"
            href="/app/dashboard"
            isActive={location.pathname === "/app/dashboard"}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            title="Clients"
            href="/app/clients"
            isActive={location.pathname.startsWith("/app/clients")}
          />
          <SidebarItem
            icon={<Warehouse className="h-5 w-5" />}
            title="Farms"
            href="/app/farms"
            isActive={location.pathname.startsWith("/app/farms")}
          />
          <SidebarItem
            icon={<Sprout className="h-5 w-5" />}
            title="Crops"
            href="/app/crops"
            isActive={location.pathname.startsWith("/app/crops")}
          />
          <SidebarItem
            icon={<Leaf className="h-5 w-5" />}
            title="Harvests"
            href="/app/harvests"
            isActive={location.pathname.startsWith("/app/harvests")}
          />
          <SidebarItem
            icon={<Package className="h-5 w-5" />}
            title="Inventory"
            href="/app/inventory"
            isActive={location.pathname.startsWith("/app/inventory")}
          />
          <SidebarItem
            icon={<ShoppingCart className="h-5 w-5" />}
            title="Orders"
            href="/app/orders"
            isActive={location.pathname.startsWith("/app/orders")}
          />
          <SidebarItem
            icon={<UserCog className="h-5 w-5" />}
            title="Staff"
            href="/app/staff"
            isActive={location.pathname.startsWith("/app/staff")}
          />
          <SidebarItem
            icon={<BarChart3 className="h-5 w-5" />}
            title="Sustainability"
            href="/app/sustainability"
            isActive={location.pathname.startsWith("/app/sustainability")}
          />
          {isAdmin && (
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              title="Settings"
              href="/app/settings"
              isActive={location.pathname.startsWith("/app/settings")}
            />
          )}
        </div>
      </nav>
    </aside>
  )
}
