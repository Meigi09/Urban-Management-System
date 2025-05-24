import { useAuth } from "@/contexts/auth-context"

export type UserRole = "ADMIN" | "MANAGER" | "STAFF" | "USER"

export interface RolePermissions {
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  canManageUsers: boolean
  canViewReports: boolean
  canManageSettings: boolean
}

export type { RolePermissions }

const rolePermissions: Record<UserRole, RolePermissions> = {
  ADMIN: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: true,
  },
  MANAGER: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
  },
  STAFF: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
  USER: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
}

export function useRoleAuth() {
  const { user } = useAuth()

  const getUserRole = (): UserRole => {
    if (!user) return "USER"
    return (user.role?.toUpperCase() as UserRole) || "USER"
  }

  const getPermissions = (): RolePermissions => {
    const role = getUserRole()
    return rolePermissions[role]
  }

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    const permissions = getPermissions()
    return permissions[permission]
  }

  const canAccess = (requiredRole: UserRole): boolean => {
    const currentRole = getUserRole()
    const roleHierarchy: UserRole[] = ["USER", "STAFF", "MANAGER", "ADMIN"]

    const currentRoleIndex = roleHierarchy.indexOf(currentRole)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

    return currentRoleIndex >= requiredRoleIndex
  }

  const canAccessResource = (resource: string, action: keyof RolePermissions): boolean => {
    return hasPermission(action)
  }

  return {
    user,
    role: getUserRole(),
    permissions: getPermissions(),
    hasPermission,
    canAccess,
    canAccessResource,
    isAdmin: () => getUserRole() === "ADMIN",
    isManager: () => getUserRole() === "MANAGER",
    isStaff: () => getUserRole() === "STAFF",
    isUser: () => getUserRole() === "USER",
  }
}
