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
        className={cn("w-full justify-start gap-2", isActive && "bg-accent text-accent-foreground")}
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
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Urban Farming</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard"
            href="/"
            isActive={location.pathname === "/"}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            title="Clients"
            href="/clients"
            isActive={location.pathname.startsWith("/clients")}
          />
          <SidebarItem
            icon={<Warehouse className="h-5 w-5" />}
            title="Farms"
            href="/farms"
            isActive={location.pathname.startsWith("/farms")}
          />
          <SidebarItem
            icon={<Sprout className="h-5 w-5" />}
            title="Crops"
            href="/crops"
            isActive={location.pathname.startsWith("/crops")}
          />
          <SidebarItem
            icon={<Leaf className="h-5 w-5" />}
            title="Harvests"
            href="/harvests"
            isActive={location.pathname.startsWith("/harvests")}
          />
          <SidebarItem
            icon={<Package className="h-5 w-5" />}
            title="Inventory"
            href="/inventory"
            isActive={location.pathname.startsWith("/inventory")}
          />
          <SidebarItem
            icon={<ShoppingCart className="h-5 w-5" />}
            title="Orders"
            href="/orders"
            isActive={location.pathname.startsWith("/orders")}
          />
          <SidebarItem
            icon={<UserCog className="h-5 w-5" />}
            title="Staff"
            href="/staff"
            isActive={location.pathname.startsWith("/staff")}
          />
          <SidebarItem
            icon={<BarChart3 className="h-5 w-5" />}
            title="Sustainability"
            href="/sustainability"
            isActive={location.pathname.startsWith("/sustainability")}
          />
          {isAdmin && (
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              title="Settings"
              href="/settings"
              isActive={location.pathname.startsWith("/settings")}
            />
          )}
        </div>
      </nav>
    </aside>
  )
}
