import axios from "axios"
import { toast } from "@/hooks/use-toast"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred"

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // Only show error toasts for non-demo scenarios
    // For demo purposes, we'll handle errors gracefully without showing error messages
    if (!window.location.pathname.includes('/dashboard')) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  },
)

// Client API
export const clientApi = {
  getAll: () => api.get("/clients"),
  getById: (id: number) => api.get(`/clients/${id}`),
  create: (client: any) => api.post("/clients", client),
  update: (id: number, client: any) => api.put(`/clients/${id}`, client),
  delete: (id: number) => api.delete(`/clients/${id}`),
  assignOrder: (clientId: number, order: any) => api.post(`/clients/${clientId}/assign-order`, order),
  updatePaymentHistory: (clientId: number, paymentHistory: string) =>
    api.put(`/clients/${clientId}/payment-history`, paymentHistory),
  updatePreferences: (clientId: number, preferences: string) =>
    api.put(`/clients/${clientId}/preferences`, preferences),
  placeOrder: (clientId: number, inventoryId: number, quantityOrdered: number) =>
    api.post(`/clients/${clientId}/place-order?inventoryId=${inventoryId}&quantityOrdered=${quantityOrdered}`),
}

// Farm API
export const farmApi = {
  create: (data: any) => api.post("/farms", data),
  update: (id: number, data: any) => api.put(`/farms/${id}`, data),
  getAll: () => api.get("/farms"),
  getById: (id: number) => api.get(`/farms/${id}`),
  delete: (id: number) => api.delete(`/farms/${id}`),
  trackCrops: (farmId: number, cropType: string, plantingSchedule: string, growingConditions: boolean) =>
    api.post(
      `/farms/${farmId}/track-crops?cropType=${cropType}&plantingSchedule=${plantingSchedule}&growingConditions=${growingConditions}`,
    ),
  manageStaff: (farmId: number, staffId: number) => api.post(`/farms/${farmId}/manage-staff/${staffId}`),
  trackMetrics: (farmId: number, metricsId: number) => api.post(`/farms/${farmId}/track-metrics/${metricsId}`),
  getTotalYield: (farmId: number) => api.get(`/farms/${farmId}/total-yield`),
  getSustainabilityReport: (farmId: number) => api.get(`/farms/${farmId}/sustainability-report`),
  getByStaffId: (staffId: number) => api.get(`/farms/staff/${staffId}`),
}

// Crop API
export const cropApi = {
  getAll: () => api.get("/crops"),
  getById: (id: number) => api.get(`/crops/${id}`),
  create: (crop: any) => api.post("/crops", crop),
  update: (id: number, crop: any) => api.put(`/crops/${id}`, crop),
  delete: (id: number) => api.delete(`/crops/${id}`),
  getByType: (type: string) => api.get(`/crops/type/${type}`),
  getByFarm: (farmId: number) => api.get(`/crops/farm/${farmId}`),
  getBySeason: (season: string) => api.get(`/crops/season/${season}`),
  getByLocation: (location: string) => api.get(`/crops/location-requirement/${location}`),
  recordHarvest: (cropId: number, yield_: number, qualityRating: number) =>
    api.post(`/crops/${cropId}/record-harvest?yield=${yield_}&qualityRating=${qualityRating}`),
  recordMetrics: (
    cropId: number,
    waterUsage: number,
    soilHealth: number,
    pesticideApplication: number,
    energyUsage: number,
  ) =>
    api.post(
      `/crops/${cropId}/record-metrics?waterUsage=${waterUsage}&soilHealth=${soilHealth}&pesticideApplication=${pesticideApplication}&energyUsage=${energyUsage}`,
    ),
  getSustainabilityScore: (cropId: number) => api.get(`/crops/${cropId}/sustainability-score`),
  assignToFarm: (cropId: number, farmId: number) => api.post(`/crops/${cropId}/assign-to-farm/${farmId}`),
  updatePlantingSchedule: (cropId: number, newSchedule: string) =>
    api.put(`/crops/${cropId}/update-planting-schedule?newSchedule=${newSchedule}`),
}

// Harvest API
export const harvestApi = {
  getAll: () => api.get("/harvests"),
  getById: (id: number) => api.get(`/harvests/${id}`),
  create: (harvest: any) => api.post("/harvests", harvest),
  update: (id: number, data: any) => api.put(`/harvests/${id}`, data),
  delete: (id: number) => api.delete(`/harvests/${id}`),
  getByQualityRating: (rating: number) => api.get(`/harvests/quality-rating/${rating}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get(`/harvests/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByFarm: (farmId: number) => api.get(`/harvests/farm/${farmId}`),
  getByCrop: (cropId: number) => api.get(`/harvests/crop/${cropId}`),
  getByInventory: (inventoryId: number) => api.get(`/harvests/inventory/${inventoryId}`),
  updateQuality: (harvestId: number, qualityRating: number) =>
    api.put(`/harvests/${harvestId}/update-quality?qualityRating=${qualityRating}`),
  updateYield: (harvestId: number, yield_: number) => api.put(`/harvests/${harvestId}/update-yield?yield=${yield_}`),
  getTotalYield: () => api.get("/harvests/total-yield"),
  getTotalYieldByFarm: (farmId: number) => api.get(`/harvests/total-yield/farm/${farmId}`),
  getTotalYieldByCrop: (cropId: number) => api.get(`/harvests/total-yield/crop/${cropId}`),
  transferToInventory: (harvestId: number, inventoryId: number) =>
    api.post(`/harvests/${harvestId}/transfer-to-inventory/${inventoryId}`),
}

// Inventory API
export const inventoryApi = {
  getAll: () => api.get("/inventory"),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (inventory: any) => api.post("/inventory", inventory),
  update: (id: number, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/inventory/${id}`),
  getByProduceType: (produceType: string) => api.get(`/inventory/produce-type/${produceType}`),
  updateStock: (harvestId: number, harvestAmount: number) =>
    api.put(`/inventory/update-stock/${harvestId}/${harvestAmount}`),
  linkToOrder: (inventoryId: number, order: any) => api.post(`/inventory/link-to-orders/${inventoryId}`, order),
  trackHarvest: (harvestId: number, harvestYield: number) =>
    api.put(`/inventory/track-harvest/${harvestId}/${harvestYield}`),
  checkAvailability: (inventoryId: number, requiredQuantity: number) =>
    api.get(`/inventory/check-availability/${inventoryId}/${requiredQuantity}`),
  updateQuantityAfterOrder: (inventoryId: number, orderedQuantity: number) =>
    api.put(`/inventory/update-quantity/${inventoryId}/${orderedQuantity}`),
}

// Order API
export const orderApi = {
  getAll: () => api.get("/orders"),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (order: any) => api.post("/orders", order),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  updateStatus: (orderId: number, deliveryStatus: string) =>
    api.put(`/orders/${orderId}/update-status?deliveryStatus=${deliveryStatus}`),
  placeOrder: (orderId: number) => api.post(`/orders/${orderId}/place-order`),
  cancelOrder: (orderId: number) => api.post(`/orders/${orderId}/cancel-order`),
  getByStatus: (status: string) => api.get(`/orders/status/${status}`),
}

// Staff and Volunteer API
export const staffApi = {
  getAll: () => api.get("/staff-and-volunteers"),
  getById: (id: number) => api.get(`/staff-and-volunteers/${id}`),
  create: (staff: any) => api.post("/staff-and-volunteers", staff),
  update: (id: number, staff: any) => api.put(`/staff-and-volunteers/${id}`, staff),
  delete: (id: number) => api.delete(`/staff-and-volunteers/${id}`),
  getAllStaff: () => api.get("/staff-and-volunteers/staff"),
  getAllVolunteers: () => api.get("/staff-and-volunteers/volunteers"),
  assignToFarm: (personId: number, farmId: number) =>
    api.post(`/staff-and-volunteers/${personId}/assign-to-farm/${farmId}`),
  assignTask: (personId: number, task: string) =>
    api.post(`/staff-and-volunteers/${personId}/assign-task?task=${task}`),
  getByFarm: (farmId: number) => api.get(`/staff-and-volunteers/farm/${farmId}`),
  getTotalWorkHours: (farmId: number) => api.get(`/staff-and-volunteers/farm/${farmId}/total-work-hours`),
  updateWorkHours: (personId: number, newHours: number) =>
    api.put(`/staff-and-volunteers/${personId}/update-work-hours?newHours=${newHours}`),
}

// Sustainability API
export const sustainabilityApi = {
  getAll: () => api.get("/sustainability/metrics"),
  getById: (id: number) => api.get(`/sustainability/metrics/${id}`),
  create: (metric: any) => api.post("/sustainability/metrics", metric),
  update: (id: number, metric: any) => api.put(`/sustainability/metrics/${id}`, metric),
  delete: (id: number) => api.delete(`/sustainability/metrics/${id}`),
  getByCrop: (cropId: number) => api.get(`/sustainability/metrics/crop/${cropId}`),
  getByFarm: (farmId: number) => api.get(`/sustainability/metrics/farm/${farmId}`),
  getByWaterUsage: (waterUsage: number) => api.get(`/sustainability/metrics/water-usage/${waterUsage}`),
  getByWaterUsageBelow: (threshold: number) => api.get(`/sustainability/metrics/water-usage/below/${threshold}`),
  getBySoilHealthAbove: (threshold: number) => api.get(`/sustainability/metrics/soil-health/above/${threshold}`),
  getByPesticideApplicationBelow: (threshold: number) =>
    api.get(`/sustainability/metrics/pesticide-application/below/${threshold}`),
  getByEnergyUsageBelow: (threshold: number) => api.get(`/sustainability/metrics/energy-usage/below/${threshold}`),
  getAverageWaterUsage: (farmId: number) => api.get(`/sustainability/metrics/farm/${farmId}/average-water-usage`),
  getAverageSoilHealth: (farmId: number) => api.get(`/sustainability/metrics/farm/${farmId}/average-soil-health`),
  getSustainabilityScore: (farmId: number) => api.get(`/sustainability/metrics/farm/${farmId}/sustainability-score`),
  getRecommendations: (farmId: number) => api.get(`/sustainability/metrics/farm/${farmId}/recommendations`),
}

export default api
