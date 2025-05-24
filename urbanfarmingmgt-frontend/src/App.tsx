import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { SearchProvider } from "@/contexts/search-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import Layout from "@/components/layout"
import ProtectedRoute from "@/components/protected-route"

// Landing page
import LandingPage from "@/pages/landing"

// Auth pages
import Login from "@/pages/auth/login"
import Register from "@/pages/auth/register"
import ForgotPassword from "@/pages/auth/forgot-password"
import ResetPassword from "@/pages/auth/reset-password"
import TwoFactorAuth from "@/pages/auth/two-factor-auth"

// Main pages
import Dashboard from "@/pages/dashboard"
import Settings from "@/pages/settings"
import NotFound from "@/pages/not-found"

// Entity pages
import Clients from "@/pages/clients"
import ClientDetail from "@/pages/clients/client-detail"
import NewClient from "@/pages/clients/new"
import EditClient from "@/pages/clients/edit/[id]"

import Crops from "@/pages/crops"
import CropDetail from "@/pages/crops/crop-detail"
import NewCrop from "@/pages/crops/new"
import EditCrop from "@/pages/crops/edit/[id]"

import Farms from "@/pages/farms"
import FarmDetail from "@/pages/farms/farm-detail"
import NewFarm from "@/pages/farms/new"
import EditFarm from "@/pages/farms/edit/[id]"

import Harvests from "@/pages/harvests"
import HarvestDetail from "@/pages/harvests/harvest-detail"
import NewHarvest from "@/pages/harvests/new"
import EditHarvest from "@/pages/harvests/edit/[id]"

import Inventory from "@/pages/inventory"
import InventoryDetail from "@/pages/inventory/inventory-detail"
import NewInventory from "@/pages/inventory/new"
import EditInventory from "@/pages/inventory/edit/[id]"

import Orders from "@/pages/orders"
import OrderDetail from "@/pages/orders/order-detail"
import NewOrder from "@/pages/orders/new"
import EditOrder from "@/pages/orders/edit/[id]"

import Staff from "@/pages/staff"
import StaffDetail from "@/pages/staff/staff-detail"
import NewStaff from "@/pages/staff/new"
import EditStaff from "@/pages/staff/edit/[id]"

import Sustainability from "@/pages/sustainability"
import SustainabilityDetail from "@/pages/sustainability/sustainability-detail"
import NewSustainability from "@/pages/sustainability/new"
import EditSustainability from "@/pages/sustainability/edit/[id]"
import SustainabilityActionPlan from "@/pages/sustainability/action-plan"
import SustainabilityRecommendations from "@/pages/sustainability/recommendations"

function App() {
  return (
      <>
        <ThemeProvider>
          <AuthProvider>
            <SearchProvider>
              <NotificationsProvider>
                <Routes>
                  {/* Landing page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/two-factor-auth" element={<TwoFactorAuth />} />

                  {/* Redirect old routes to new structure */}
                  <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="/clients" element={<Navigate to="/app/clients" replace />} />
                  <Route path="/farms" element={<Navigate to="/app/farms" replace />} />
                  <Route path="/crops" element={<Navigate to="/app/crops" replace />} />
                  <Route path="/harvests" element={<Navigate to="/app/harvests" replace />} />
                  <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
                  <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
                  <Route path="/staff" element={<Navigate to="/app/staff" replace />} />
                  <Route path="/sustainability" element={<Navigate to="/app/sustainability" replace />} />
                  <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

                  {/* Protected routes */}
                  <Route
                      path="/app"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                  >
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />

                {/* Clients routes */}
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="clients/new" element={<NewClient />} />
                <Route path="clients/edit/:id" element={<EditClient />} />

                {/* Crops routes */}
                <Route path="crops" element={<Crops />} />
                <Route path="crops/:id" element={<CropDetail />} />
                <Route path="crops/new" element={<NewCrop />} />
                <Route path="crops/edit/:id" element={<EditCrop />} />

                {/* Farms routes */}
                <Route path="farms" element={<Farms />} />
                <Route path="farms/:id" element={<FarmDetail />} />
                <Route path="farms/new" element={<NewFarm />} />
                <Route path="farms/edit/:id" element={<EditFarm />} />

                {/* Harvests routes */}
                <Route path="harvests" element={<Harvests />} />
                <Route path="harvests/:id" element={<HarvestDetail />} />
                <Route path="harvests/new" element={<NewHarvest />} />
                <Route path="harvests/edit/:id" element={<EditHarvest />} />

                {/* Inventory routes */}
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/:id" element={<InventoryDetail />} />
                <Route path="inventory/new" element={<NewInventory />} />
                <Route path="inventory/edit/:id" element={<EditInventory />} />

                {/* Orders routes */}
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="orders/new" element={<NewOrder />} />
                <Route path="orders/edit/:id" element={<EditOrder />} />

                {/* Staff routes */}
                <Route path="staff" element={<Staff />} />
                <Route path="staff/:id" element={<StaffDetail />} />
                <Route path="staff/new" element={<NewStaff />} />
                <Route path="staff/edit/:id" element={<EditStaff />} />

                {/* Sustainability routes */}
                <Route path="sustainability" element={<Sustainability />} />
                <Route path="sustainability/:id" element={<SustainabilityDetail />} />
                <Route path="sustainability/new" element={<NewSustainability />} />
                <Route path="sustainability/edit/:id" element={<EditSustainability />} />
                <Route path="sustainability/:id/action-plan" element={<SustainabilityActionPlan />} />
                <Route path="sustainability/:id/recommendations" element={<SustainabilityRecommendations />} />
              </Route>

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </NotificationsProvider>
            </SearchProvider>
          </AuthProvider>
        </ThemeProvider>
      </>
  )
}

export default App
