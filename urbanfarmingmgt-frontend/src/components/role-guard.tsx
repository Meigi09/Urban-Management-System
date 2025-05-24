import React from "react"
import { useRoleAuth } from "@/hooks/use-role-auth"
import type { UserRole, RolePermissions } from "@/hooks/use-role-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: keyof RolePermissions
  fallback?: React.ReactNode
  showFallback?: boolean
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  showFallback = true,
}: RoleGuardProps) {
  const { canAccess, hasPermission } = useRoleAuth()

  const hasAccess = React.useMemo(() => {
    if (requiredRole && !canAccess(requiredRole)) {
      return false
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return false
    }

    return true
  }, [requiredRole, requiredPermission, canAccess, hasPermission])

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    if (showFallback) {
      return (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this resource.
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return <>{children}</>
}

// Convenience components for common role checks
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="ADMIN" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function ManagerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="MANAGER" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function StaffOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="STAFF" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Permission-based guards
export function CanCreate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission="canCreate" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function CanUpdate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission="canUpdate" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function CanDelete({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission="canDelete" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function CanManageUsers({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission="canManageUsers" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
