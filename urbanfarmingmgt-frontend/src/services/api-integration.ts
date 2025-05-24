import api from "@/lib/api"
import type {
  Farm,
  Crop,
  Harvest,
  Inventory,
  Order,
  Client,
  StaffAndVolunteer,
  SustainabilityMetric,
  FarmFormData,
  CropFormData,
  HarvestFormData,
  InventoryFormData,
  OrderFormData,
  ClientFormData,
  StaffFormData,
  SustainabilityMetricFormData
} from "@/types/models"

// Farm API - Matching your backend exactly
export const farmApi = {
  getAll: async (): Promise<Farm[]> => {
    const response = await api.get('/farms')
    return response.data
  },

  getById: async (id: number): Promise<Farm> => {
    const response = await api.get(`/farms/${id}`)
    return response.data
  },

  create: async (farm: FarmFormData): Promise<string> => {
    const response = await api.post('/farms', farm)
    return response.data
  },

  update: async (id: number, farm: FarmFormData): Promise<string> => {
    const response = await api.put(`/farms/${id}`, farm)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`/farms/${id}`)
    return response.data
  },

  searchByName: async (name: string): Promise<Farm[]> => {
    const response = await api.get(`/farms/search?name=${encodeURIComponent(name)}`)
    return response.data
  },

  getByCropType: async (cropType: string): Promise<Farm[]> => {
    const response = await api.get(`/farms/crop-type/${encodeURIComponent(cropType)}`)
    return response.data
  },

  getByStaffId: async (staffId: number): Promise<Farm[]> => {
    const response = await api.get(`/farms/staff/${staffId}`)
    return response.data
  },

  trackCrops: async (farmId: number, cropType: string, plantingSchedule: string, growingConditions: boolean): Promise<Crop> => {
    const params = new URLSearchParams({
      cropType,
      plantingSchedule,
      growingConditions: growingConditions.toString()
    })
    const response = await api.post(`/farms/${farmId}/track-crops?${params}`)
    return response.data
  },

  assignStaff: async (farmId: number, staffId: number): Promise<string> => {
    const response = await api.post(`/farms/${farmId}/assign-staff/${staffId}`)
    return response.data
  },

  recordSustainabilityMetrics: async (
    farmId: number,
    waterUsage: number,
    soilHealth: number,
    pesticideApplication: number,
    energyUsage: number
  ): Promise<SustainabilityMetric> => {
    const params = new URLSearchParams({
      waterUsage: waterUsage.toString(),
      soilHealth: soilHealth.toString(),
      pesticideApplication: pesticideApplication.toString(),
      energyUsage: energyUsage.toString()
    })
    const response = await api.post(`/farms/${farmId}/record-metrics?${params}`)
    return response.data
  },

  getSustainabilityScore: async (farmId: number): Promise<number> => {
    const response = await api.get(`/farms/${farmId}/sustainability-score`)
    return response.data
  }
}

// Crop API - Matching your backend exactly
export const cropApi = {
  getAll: async (): Promise<Crop[]> => {
    const response = await api.get('/crops')
    return response.data
  },

  getById: async (id: number): Promise<Crop> => {
    const response = await api.get(`/crops/${id}`)
    return response.data
  },

  create: async (crop: CropFormData): Promise<string> => {
    const response = await api.post('/crops', crop)
    return response.data
  },

  update: async (id: number, crop: CropFormData): Promise<string> => {
    const response = await api.put(`/crops/${id}`, crop)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`/crops/${id}`)
    return response.data
  },

  getByCropType: async (cropType: string): Promise<Crop[]> => {
    const response = await api.get(`/crops/type/${encodeURIComponent(cropType)}`)
    return response.data
  },

  getByFarm: async (farmId: number): Promise<Crop[]> => {
    const response = await api.get(`/crops/farm/${farmId}`)
    return response.data
  },

  getBySeason: async (season: string): Promise<Crop[]> => {
    const response = await api.get(`/crops/season/${encodeURIComponent(season)}`)
    return response.data
  },

  getByLocationRequirement: async (location: string): Promise<Crop[]> => {
    const response = await api.get(`/crops/location-requirement/${encodeURIComponent(location)}`)
    return response.data
  },

  getEligibleForLocation: async (location: string): Promise<Crop[]> => {
    const response = await api.get(`/crops/eligible-for-location?location=${encodeURIComponent(location)}`)
    return response.data
  },

  recordHarvest: async (cropId: number, yield_: number, qualityRating: number): Promise<Harvest> => {
    const params = new URLSearchParams({
      yield: yield_.toString(),
      qualityRating: qualityRating.toString()
    })
    const response = await api.post(`/crops/${cropId}/record-harvest?${params}`)
    return response.data
  },

  recordSustainabilityMetrics: async (
    cropId: number,
    waterUsage: number,
    soilHealth: number,
    pesticideApplication: number,
    energyUsage: number
  ): Promise<SustainabilityMetric> => {
    const params = new URLSearchParams({
      waterUsage: waterUsage.toString(),
      soilHealth: soilHealth.toString(),
      pesticideApplication: pesticideApplication.toString(),
      energyUsage: energyUsage.toString()
    })
    const response = await api.post(`/crops/${cropId}/record-metrics?${params}`)
    return response.data
  },

  getSustainabilityScore: async (cropId: number): Promise<number> => {
    const response = await api.get(`/crops/${cropId}/sustainability-score`)
    return response.data
  },

  assignToFarm: async (cropId: number, farmId: number): Promise<string> => {
    const response = await api.post(`/crops/${cropId}/assign-to-farm/${farmId}`)
    return response.data
  },

  updatePlantingSchedule: async (cropId: number, newSchedule: string): Promise<string> => {
    const response = await api.put(`/crops/${cropId}/update-planting-schedule?newSchedule=${encodeURIComponent(newSchedule)}`)
    return response.data
  }
}

// Staff API - Matching your backend exactly
export const staffApi = {
  getAll: async (): Promise<StaffAndVolunteer[]> => {
    const response = await api.get('/staff')
    return response.data
  },

  getById: async (id: number): Promise<StaffAndVolunteer> => {
    const response = await api.get(`/staff/${id}`)
    return response.data
  },

  create: async (staff: StaffFormData): Promise<string> => {
    const response = await api.post('/staff', staff)
    return response.data
  },

  update: async (id: number, staff: StaffFormData): Promise<string> => {
    const response = await api.put(`/staff/${id}`, staff)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`/staff/${id}`)
    return response.data
  },

  getByRole: async (role: string): Promise<StaffAndVolunteer[]> => {
    const response = await api.get(`/staff/role/${encodeURIComponent(role)}`)
    return response.data
  },

  getByFarm: async (farmId: number): Promise<StaffAndVolunteer[]> => {
    const response = await api.get(`/staff/farm/${farmId}`)
    return response.data
  },

  assignToFarm: async (staffId: number, farmId: number): Promise<string> => {
    const response = await api.post(`/staff/${staffId}/assign-farm/${farmId}`)
    return response.data
  },

  updateWorkHours: async (staffId: number, workHours: number): Promise<string> => {
    const response = await api.put(`/staff/${staffId}/update-work-hours?workHours=${workHours}`)
    return response.data
  },

  updateTask: async (staffId: number, task: string): Promise<string> => {
    const response = await api.put(`/staff/${staffId}/update-task?task=${encodeURIComponent(task)}`)
    return response.data
  }
}

// Inventory API - Matching your backend exactly
export const inventoryApi = {
  getAll: async (): Promise<Inventory[]> => {
    const response = await api.get('/inventory')
    return response.data
  },

  getById: async (id: number): Promise<Inventory> => {
    const response = await api.get(`/inventory/${id}`)
    return response.data
  },

  getByProduceType: async (produceType: string): Promise<Inventory[]> => {
    const response = await api.get(`/inventory/produce-type/${encodeURIComponent(produceType)}`)
    return response.data
  },

  create: async (item: InventoryFormData): Promise<Inventory> => {
    const response = await api.post('/inventory', item)
    return response.data
  },

  update: async (id: number, item: InventoryFormData): Promise<Inventory> => {
    const response = await api.put(`/inventory/${id}`, item)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/inventory/${id}`)
  },

  updateStock: async (inventoryId: number, harvestAmount: number): Promise<void> => {
    await api.put(`/inventory/update-stock/${inventoryId}/${harvestAmount}`)
  },

  linkToOrders: async (inventoryId: number, order: OrderFormData): Promise<void> => {
    await api.post(`/inventory/link-to-orders/${inventoryId}`, order)
  },

  trackHarvestInInventory: async (harvestId: number, harvestYield: number): Promise<void> => {
    await api.put(`/inventory/track-harvest/${harvestId}/${harvestYield}`)
  },

  checkAvailability: async (inventoryId: number, requiredQuantity: number): Promise<boolean> => {
    const response = await api.get(`/inventory/check-availability/${inventoryId}/${requiredQuantity}`)
    return response.data
  },

  updateQuantityAfterOrder: async (inventoryId: number, orderedQuantity: number): Promise<boolean> => {
    const response = await api.put(`/inventory/update-quantity/${inventoryId}/${orderedQuantity}`)
    return response.data
  }
}

// Orders API - Matching your backend exactly
export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders')
    return response.data
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  create: async (order: OrderFormData): Promise<string> => {
    const response = await api.post('/orders', order)
    return response.data
  },

  updateStatus: async (orderId: number, deliveryStatus: string): Promise<string> => {
    const response = await api.put(`/orders/${orderId}/update-status?deliveryStatus=${encodeURIComponent(deliveryStatus)}`)
    return response.data
  },

  placeOrder: async (orderId: number): Promise<string> => {
    const response = await api.post(`/orders/${orderId}/place-order`)
    return response.data
  },

  cancelOrder: async (orderId: number): Promise<string> => {
    const response = await api.post(`/orders/${orderId}/cancel-order`)
    return response.data
  },

  getByStatus: async (deliveryStatus: string): Promise<Order[]> => {
    const response = await api.get(`/orders/status/${encodeURIComponent(deliveryStatus)}`)
    return response.data
  }
}

// Clients API - Matching your backend exactly
export const clientApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/clients')
    return response.data
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  create: async (client: ClientFormData): Promise<string> => {
    const response = await api.post('/clients', client)
    return response.data
  },

  update: async (id: number, client: ClientFormData): Promise<string> => {
    const response = await api.put(`/clients/${id}`, client)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },

  assignOrder: async (clientId: number, order: OrderFormData): Promise<string> => {
    const response = await api.post(`/clients/${clientId}/assign-order`, order)
    return response.data
  },

  updatePreferences: async (clientId: number, orderPreferences: string): Promise<string> => {
    const response = await api.put(`/clients/${clientId}/preferences`, orderPreferences, {
      headers: { 'Content-Type': 'text/plain' }
    })
    return response.data
  },

  getByContactInfo: async (contactInfo: string): Promise<Client[]> => {
    const response = await api.get(`/clients/contact-info/${encodeURIComponent(contactInfo)}`)
    return response.data
  },

  placeOrder: async (clientId: number, inventoryId: number, quantityOrdered: number): Promise<Order> => {
    const params = new URLSearchParams({
      inventoryId: inventoryId.toString(),
      quantityOrdered: quantityOrdered.toString()
    })
    const response = await api.post(`/clients/${clientId}/place-order?${params}`)
    return response.data
  },

  handleDeliveryReceipt: async (orderId: number, inventoryId: number): Promise<string> => {
    const response = await api.put(`/clients/orders/${orderId}/deliver?inventoryId=${inventoryId}`)
    return response.data
  }
}

// Harvest API - Matching your backend exactly
export const harvestApi = {
  getAll: async (): Promise<Harvest[]> => {
    const response = await api.get('/harvests')
    return response.data
  },

  getById: async (id: number): Promise<Harvest> => {
    const response = await api.get(`/harvests/${id}`)
    return response.data
  },

  create: async (harvest: HarvestFormData): Promise<string> => {
    const response = await api.post('/harvests', harvest)
    return response.data
  },

  update: async (id: number, harvest: HarvestFormData): Promise<string> => {
    const response = await api.put(`/harvests/${id}`, harvest)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`/harvests/${id}`)
    return response.data
  },

  recordYield: async (cropId: number, yield_: number, qualityRating: number): Promise<string> => {
    const params = new URLSearchParams({
      cropId: cropId.toString(),
      yield: yield_.toString(),
      qualityRating: qualityRating.toString()
    })
    const response = await api.post(`/harvests/record-yield?${params}`)
    return response.data
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Harvest[]> => {
    const params = new URLSearchParams({ startDate, endDate })
    const response = await api.get(`/harvests/date-range?${params}`)
    return response.data
  },

  getByCrop: async (cropId: number): Promise<Harvest[]> => {
    const response = await api.get(`/harvests/crop/${cropId}`)
    return response.data
  },

  getByFarm: async (farmId: number): Promise<Harvest[]> => {
    const response = await api.get(`/harvests/farm/${farmId}`)
    return response.data
  },

  getByInventory: async (inventoryId: number): Promise<Harvest[]> => {
    const response = await api.get(`/harvests/inventory/${inventoryId}`)
    return response.data
  },

  updateQuality: async (harvestId: number, qualityRating: number): Promise<string> => {
    const response = await api.put(`/harvests/${harvestId}/update-quality?qualityRating=${qualityRating}`)
    return response.data
  },

  updateYield: async (harvestId: number, yield_: number): Promise<string> => {
    const response = await api.put(`/harvests/${harvestId}/update-yield?yield=${yield_}`)
    return response.data
  },

  getTotalYield: async (): Promise<number> => {
    const response = await api.get('/harvests/total-yield')
    return response.data
  },

  getMostRecent: async (limit: number): Promise<Harvest[]> => {
    const response = await api.get(`/harvests/most-recent?limit=${limit}`)
    return response.data
  },

  transferToInventory: async (harvestId: number, inventoryId: number): Promise<string> => {
    const response = await api.post(`/harvests/${harvestId}/transfer-to-inventory/${inventoryId}`)
    return response.data
  }
}

// Sustainability API - Matching your backend exactly
export const sustainabilityApi = {
  getAll: async (): Promise<SustainabilityMetric[]> => {
    const response = await api.get('/sustainability/metrics')
    return response.data
  },

  getById: async (id: number): Promise<SustainabilityMetric> => {
    const response = await api.get(`/sustainability/metrics/${id}`)
    return response.data
  },

  create: async (metric: SustainabilityMetricFormData): Promise<SustainabilityMetric> => {
    const response = await api.post('/sustainability/metrics', metric)
    return response.data
  },

  update: async (id: number, metric: SustainabilityMetricFormData): Promise<SustainabilityMetric> => {
    const response = await api.put(`/sustainability/metrics/${id}`, metric)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sustainability/metrics/${id}`)
  }
}

// Dashboard API - Basic stats from your entities
export const dashboardApi = {
  getStats: async (): Promise<any> => {
    // Since you don't have a specific dashboard endpoint, we'll aggregate from entities
    const [farms, crops, harvests, inventory, orders, clients, staff] = await Promise.all([
      farmApi.getAll(),
      cropApi.getAll(),
      harvestApi.getAll(),
      inventoryApi.getAll(),
      orderApi.getAll(),
      clientApi.getAll(),
      staffApi.getAll()
    ])

    return {
      totalFarms: farms.length,
      totalCrops: crops.length,
      totalHarvests: harvests.length,
      totalInventory: inventory.length,
      totalOrders: orders.length,
      totalClients: clients.length,
      totalStaff: staff.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.quantityOrdered * 10), 0) // Estimated
    }
  }
}

// Global Search API - Search across entities
export const searchApi = {
  global: async (query: string): Promise<any[]> => {
    const results: any[] = []

    try {
      // Search farms by name
      const farms = await farmApi.searchByName(query)
      results.push(...farms.map(farm => ({ ...farm, type: 'farm' })))
    } catch (e) { /* ignore */ }

    try {
      // Search crops by type
      const crops = await cropApi.getByCropType(query)
      results.push(...crops.map(crop => ({ ...crop, type: 'crop' })))
    } catch (e) { /* ignore */ }

    try {
      // Search clients by contact info
      const clients = await clientApi.getByContactInfo(query)
      results.push(...clients.map(client => ({ ...client, type: 'client' })))
    } catch (e) { /* ignore */ }

    return results
  }
}

// Export all APIs
export const apiIntegration = {
  farm: farmApi,
  crop: cropApi,
  staff: staffApi,
  inventory: inventoryApi,
  order: orderApi,
  client: clientApi,
  harvest: harvestApi,
  sustainability: sustainabilityApi,
  dashboard: dashboardApi,
  search: searchApi
}
