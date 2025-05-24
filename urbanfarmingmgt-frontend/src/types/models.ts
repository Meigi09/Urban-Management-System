// Backend Model Types - Exact match with your Java models

export interface Farm {
  farmID: number
  name: string
  location: string
  totalPlantingArea: number
  crops?: Crop[]
  harvests?: Harvest[]
  assignedStaff?: StaffAndVolunteer[]
  sustainabilityMetrics?: SustainabilityMetric[]
}

export interface Crop {
  cropID: number
  cropType: string
  plantingSchedule: string // Date as ISO string
  growingConditions: boolean
  averageYield?: number
  growingSeason: string
  locationRequirement: string
  farm: Farm
  inventory: Inventory
  harvests?: Harvest[]
  sustainabilityMetrics?: SustainabilityMetric[]
}

export interface Harvest {
  harvestID: number
  date: string // Date as ISO string
  yield: number
  qualityRating: number
  crop: Crop
  farm: Farm
  inventory: Inventory
}

export interface Inventory {
  inventoryID: number
  quantity: number
  freshnessStatus: boolean
  storageLocation: string
  stock: number
  produceType: string
  harvestList?: Harvest[]
  cropList?: Crop[]
  orderList?: Order[]
}

export interface Order {
  orderID: number
  orderDate: string // Date as ISO string
  quantityOrdered: number
  deliveryStatus: string
  clientList?: Client[]
  inventory: Inventory
}

export interface Client {
  clientID: number
  name: string
  contactInfo: string
  orderPreferences: string
  paymentHistory: string
  order: Order
}

export interface StaffAndVolunteer {
  personID: number
  name: string
  role: string
  assignedTask: string
  workHours: number
  assignedFarm?: Farm
}

export interface SustainabilityMetric {
  metricID: number
  waterUsage: number
  soilHealth: number
  pesticideApplication: number
  energyUsage: number
  farm: Farm
  crop: Crop
}

// Form types for creating/updating entities
export interface FarmFormData {
  name: string
  location: string
  totalPlantingArea: number
}

export interface CropFormData {
  cropType: string
  plantingSchedule: string
  growingConditions: boolean
  averageYield?: number
  growingSeason: string
  locationRequirement: string
  farmID?: number
  inventoryID?: number
}

export interface HarvestFormData {
  date: string
  yield: number
  qualityRating: number
  cropID: number
  farmID: number
  inventoryID: number
}

export interface InventoryFormData {
  quantity: number
  freshnessStatus: boolean
  storageLocation: string
  stock: number
  produceType: string
}

export interface OrderFormData {
  orderDate: string
  quantityOrdered: number
  deliveryStatus: string
  inventoryID: number
}

export interface ClientFormData {
  name: string
  contactInfo: string
  orderPreferences: string
  paymentHistory: string
  orderID: number
}

export interface StaffFormData {
  name: string
  role: string
  assignedTask: string
  workHours: number
  assignedFarmID?: number
}

export interface SustainabilityMetricFormData {
  waterUsage: number
  soilHealth: number
  pesticideApplication: number
  energyUsage: number
  farmID: number
  cropID: number
}
