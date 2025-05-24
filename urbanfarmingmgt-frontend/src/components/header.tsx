import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Search, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useSearch } from "@/contexts/search-context"
import EnhancedGlobalSearch from "./enhanced-global-search"
import { ThemeToggle } from "./theme-toggle"
import { NotificationsDropdown } from "./notifications-dropdown"

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1">
        <EnhancedGlobalSearch />
      </div>
      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings?tab=appearance">Appearance</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings?tab=notifications">Notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.username || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
