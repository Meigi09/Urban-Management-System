// Create a new prediction service with a simple algorithm
import axios from "axios"

// Types for predictions
export type CropYieldPrediction = {
  cropId: string
  cropName: string
  predictedYield: number
  confidenceScore: number
  factors: {
    weather: number
    soilQuality: number
    pastPerformance: number
  }
}

export type SustainabilityPrediction = {
  metricId: string
  metricName: string
  currentValue: number
  predictedValue: number
  improvementPercentage: number
  recommendations: string[]
}

export type WaterUsagePrediction = {
  farmId: string
  currentUsage: number
  predictedUsage: number
  savingsPercentage: number
  recommendations: string[]
}

export type PestRiskPrediction = {
  cropType: string
  temperature: number
  humidity: number
  season: string
  previousInfestation: boolean
  neighboringCrops: string[]
  riskScore: number
}

export type MarketPricePrediction = {
  cropType: string
  season: string
  supplyLevel: "low" | "medium" | "high"
  demandLevel: "low" | "medium" | "high"
  previousPrice: number
  organicStatus: boolean
  predictedPrice: number
}

export type PestRiskPredictionInput = {
  cropType: string
  temperature: number
  humidity: number
  season: string
  previousInfestation: boolean
  neighboringCrops: string[]
}

export type MarketPricePredictionInput = {
  cropType: string
  season: string
  supplyLevel: "low" | "medium" | "high"
  demandLevel: "low" | "medium" | "high"
  previousPrice: number
  organicStatus: boolean
}

// Simple linear regression algorithm
const linearRegression = (data: number[][]): { slope: number; intercept: number } => {
  const n = data.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0

  for (let i = 0; i < n; i++) {
    sumX += data[i][0]
    sumY += data[i][1]
    sumXY += data[i][0] * data[i][1]
    sumXX += data[i][0] * data[i][0]
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

// Predict future value based on regression model
const predictValue = (model: { slope: number; intercept: number }, x: number): number => {
  return model.slope * x + model.intercept
}

// Add random noise to make predictions more realistic
const addNoise = (value: number, noiseLevel = 0.05): number => {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value
  return value + noise
}

// Base crop yield factors (kg per square meter)
const baseYieldFactors: Record<string, number> = {
  tomato: 5.2,
  lettuce: 3.8,
  carrot: 4.0,
  potato: 6.5,
  cucumber: 4.7,
  spinach: 2.5,
  corn: 1.2,
  wheat: 0.8,
  rice: 0.9,
  soybean: 0.4,
  // Default for unknown crops
  default: 3.0,
}

// Soil quality factors
const soilFactors: Record<string, number> = {
  clay: 0.85,
  loam: 1.2,
  sandy: 0.9,
  silt: 1.1,
  peat: 1.05,
  chalky: 0.8,
  // Default for unknown soil types
  default: 1.0,
}

// Water usage base factors (liters per square meter per day)
const baseWaterFactors: Record<string, number> = {
  tomato: 4.5,
  lettuce: 3.2,
  carrot: 2.8,
  potato: 3.5,
  cucumber: 5.0,
  spinach: 2.2,
  corn: 4.8,
  wheat: 3.0,
  rice: 8.5,
  soybean: 4.2,
  // Default for unknown crops
  default: 4.0,
}

// Pest risk base factors (0-1 scale)
const basePestRiskFactors: Record<string, number> = {
  tomato: 0.6,
  lettuce: 0.5,
  carrot: 0.4,
  potato: 0.7,
  cucumber: 0.65,
  spinach: 0.45,
  corn: 0.55,
  wheat: 0.3,
  rice: 0.5,
  soybean: 0.4,
  // Default for unknown crops
  default: 0.5,
}

// Base market prices ($ per kg)
const baseMarketPrices: Record<string, number> = {
  tomato: 2.5,
  lettuce: 3.0,
  carrot: 1.8,
  potato: 1.2,
  cucumber: 2.2,
  spinach: 4.0,
  corn: 1.0,
  wheat: 0.8,
  rice: 1.5,
  soybean: 1.2,
  // Default for unknown crops
  default: 2.0,
}

/**
 * Predicts crop yield based on various factors
 * @param input Prediction input parameters
 * @returns Predicted yield in kg
 */
export function predictYield(input: any): number {
  // Get base yield factor for the crop type
  const baseYield = baseYieldFactors[input.cropType.toLowerCase()] || baseYieldFactors.default

  // Get soil quality factor
  const soilFactor = soilFactors[input.soilType.toLowerCase()] || soilFactors.default

  // Calculate water factor (optimal is around 5-6 liters per square meter per day)
  const waterFactor = Math.min(1.2, Math.max(0.6, input.waterAmount / 5.5))

  // Calculate temperature factor (most crops grow best between 15-25°C)
  const tempFactor = Math.min(1.2, Math.max(0.6, 1 - Math.abs(input.temperature - 20) / 20))

  // Calculate sunlight factor (most crops need 6-8 hours)
  const sunlightFactor = Math.min(1.2, Math.max(0.7, input.sunlightHours / 7))

  // Calculate predicted yield
  const predictedYield = baseYield * soilFactor * waterFactor * tempFactor * sunlightFactor * input.fieldSize

  // Add some controlled randomness to simulate real-world variability (±10%)
  // Use a seed based on input for consistent results during presentations
  const seed = input.cropType.length + input.fieldSize + input.temperature
  const randomFactor = 0.9 + (Math.sin(seed) * 0.1 + 0.1)

  // If we have previous yield data, use it to adjust our prediction
  if (input.previousYield) {
    const historicalFactor = input.previousYield / (predictedYield * randomFactor)
    // Blend historical data with prediction (70% prediction, 30% historical)
    return Math.round(predictedYield * randomFactor * 0.7 + predictedYield * historicalFactor * 0.3)
  }

  return Math.round(predictedYield * randomFactor)
}

/**
 * Predicts water usage for a crop
 * @param input Prediction input parameters
 * @returns Predicted water usage in liters
 */
export function predictWaterUsage(input: any): number {
  // Get base water usage for the crop type
  const baseWater = baseWaterFactors[input.cropType.toLowerCase()] || baseWaterFactors.default

  // Get soil factor (some soils retain water better)
  const soilFactor =
      {
        clay: 0.8, // Clay retains water well
        loam: 1.0, // Balanced water retention
        sandy: 1.3, // Sandy soil drains quickly
        silt: 0.9, // Good water retention
        peat: 0.85, // Good water retention
        chalky: 1.2, // Drains quickly
        default: 1.0,
      }[input.soilType.toLowerCase()] || 1.0

  // Temperature factor (higher temps = more water needed)
  const tempFactor = Math.max(0.8, Math.min(1.5, input.temperature / 20))

  // Rainfall factor (more rain = less irrigation needed)
  const rainfallFactor = Math.max(0.5, Math.min(1.0, 1 - input.rainfall / 50))

  // Season factor
  const seasonFactor =
      {
        spring: 1.1,
        summer: 1.3,
        fall: 0.9,
        winter: 0.7,
        default: 1.0,
      }[input.season.toLowerCase()] || 1.0

  // Calculate daily water usage per square meter
  const dailyWaterPerSqm = baseWater * soilFactor * tempFactor * rainfallFactor * seasonFactor

  // Calculate total water usage for the field
  const totalWaterUsage = dailyWaterPerSqm * input.fieldSize

  // Add some randomness (±15%)
  const randomFactor = 0.85 + Math.random() * 0.3

  return Math.round(totalWaterUsage * randomFactor)
}

/**
 * Predicts pest risk for a crop
 * @param input Prediction input parameters
 * @returns Predicted risk score (0-100)
 */
export function predictPestRisk(input: PestRiskPredictionInput): number {
  // Get base pest risk for the crop type
  const baseRisk = basePestRiskFactors[input.cropType.toLowerCase()] || basePestRiskFactors.default

  // Temperature factor (most pests thrive in warm weather)
  const tempFactor = Math.max(0.5, Math.min(1.5, input.temperature / 25))

  // Humidity factor (higher humidity often increases pest risk)
  const humidityFactor = Math.max(0.7, Math.min(1.4, input.humidity / 60))

  // Season factor
  const seasonFactor =
      {
        spring: 1.1,
        summer: 1.3,
        fall: 0.9,
        winter: 0.6,
        default: 1.0,
      }[input.season.toLowerCase()] || 1.0

  // Previous infestation factor
  const infestationFactor = input.previousInfestation ? 1.4 : 1.0

  // Neighboring crops factor (biodiversity can reduce pest risk)
  const diversityFactor = Math.max(0.7, Math.min(1.2, 1.2 - input.neighboringCrops.length * 0.05))

  // Calculate risk score
  let riskScore = baseRisk * tempFactor * humidityFactor * seasonFactor * infestationFactor * diversityFactor

  // Convert to 0-100 scale
  riskScore = Math.round(riskScore * 100)

  // Add some randomness (±10%)
  const randomFactor = 0.9 + Math.random() * 0.2

  return Math.min(100, Math.max(0, Math.round(riskScore * randomFactor)))
}

/**
 * Predicts market price for a crop
 * @param input Prediction input parameters
 * @returns Predicted price per kg in dollars
 */
export function predictMarketPrice(input: MarketPricePredictionInput): number {
  // Get base market price for the crop type
  const basePrice = baseMarketPrices[input.cropType.toLowerCase()] || baseMarketPrices.default

  // Season factor (prices often higher when out of season)
  const seasonFactor =
      {
        spring: 1.0,
        summer: 0.9,
        fall: 1.1,
        winter: 1.2,
        default: 1.0,
      }[input.season.toLowerCase()] || 1.0

  // Supply factor (lower supply = higher prices)
  const supplyFactor =
      {
        low: 1.3,
        medium: 1.0,
        high: 0.8,
      }[input.supplyLevel] || 1.0

  // Demand factor (higher demand = higher prices)
  const demandFactor =
      {
        low: 0.8,
        medium: 1.0,
        high: 1.3,
      }[input.demandLevel] || 1.0

  // Organic status factor (organic typically commands premium)
  const organicFactor = input.organicStatus ? 1.4 : 1.0

  // Calculate predicted price
  let predictedPrice = basePrice * seasonFactor * supplyFactor * demandFactor * organicFactor

  // Add some randomness (±15%)
  const randomFactor = 0.85 + Math.random() * 0.3

  // Blend with previous price data (70% prediction, 30% historical)
  if (input.previousPrice > 0) {
    const historicalFactor = input.previousPrice / (predictedPrice * randomFactor)
    predictedPrice = predictedPrice * randomFactor * 0.7 + predictedPrice * historicalFactor * 0.3
  } else {
    predictedPrice = predictedPrice * randomFactor
  }

  // Round to 2 decimal places
  return Math.round(predictedPrice * 100) / 100
}

/**
 * Predicts optimal harvest date based on planting date and crop type
 * @param plantingDate Date when crop was planted
 * @param cropType Type of crop
 * @param temperature Average temperature
 * @returns Predicted harvest date
 */
export function predictHarvestDate(plantingDate: Date, cropType: string, temperature: number): Date {
  // Base growing days for different crops
  const baseGrowingDays: Record<string, number> = {
    tomato: 80,
    lettuce: 45,
    carrot: 70,
    potato: 90,
    cucumber: 60,
    spinach: 40,
    corn: 80,
    wheat: 110,
    rice: 120,
    soybean: 100,
    // Default for unknown crops
    default: 75,
  }

  // Get base days for the crop type
  const baseDays = baseGrowingDays[cropType.toLowerCase()] || baseGrowingDays.default

  // Temperature factor (higher temps generally speed growth, within limits)
  // Optimal temperature is around 20-25°C for most crops
  let tempFactor = 1.0
  if (temperature < 15) {
    // Colder temperatures slow growth
    tempFactor = 1.2
  } else if (temperature > 30) {
    // Very hot temperatures can stress plants
    tempFactor = 1.1
  } else if (temperature >= 20 && temperature <= 25) {
    // Optimal temperature range
    tempFactor = 0.9
  }

  // Calculate adjusted growing days
  const adjustedDays = Math.round(baseDays * tempFactor)

  // Add some randomness (±10%)
  const randomFactor = 0.9 + Math.random() * 0.2
  const finalDays = Math.round(adjustedDays * randomFactor)

  // Calculate harvest date
  const harvestDate = new Date(plantingDate)
  harvestDate.setDate(harvestDate.getDate() + finalDays)

  return harvestDate
}

// Prediction service
export const PredictionService = {
  // Predict crop yields based on historical data
  predictCropYields: async (cropId: string): Promise<CropYieldPrediction> => {
    try {
      // In a real app, fetch historical data from API
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/crops/${cropId}/history`)
      const historicalData = response.data

      // For demo purposes, generate some mock data if API fails
      const mockData = [
        [1, 120], // Month 1, Yield 120
        [2, 135],
        [3, 128],
        [4, 142],
        [5, 150],
        [6, 145],
      ]

      const dataToUse = historicalData?.yields || mockData

      // Apply linear regression
      const model = linearRegression(dataToUse)

      // Predict next month's yield
      const nextMonth = dataToUse.length + 1
      const predictedYield = addNoise(predictValue(model, nextMonth))

      // Generate confidence score (simplified)
      const confidenceScore = 0.7 + Math.random() * 0.2

      return {
        cropId,
        cropName: historicalData?.name || "Sample Crop",
        predictedYield: Math.round(predictedYield * 10) / 10,
        confidenceScore: Math.round(confidenceScore * 100) / 100,
        factors: {
          weather: 0.3 + Math.random() * 0.4,
          soilQuality: 0.5 + Math.random() * 0.3,
          pastPerformance: 0.6 + Math.random() * 0.3,
        },
      }
    } catch (error) {
      console.error("Error predicting crop yields:", error)

      // Return fallback prediction
      return {
        cropId,
        cropName: "Unknown Crop",
        predictedYield: 130 + Math.random() * 30,
        confidenceScore: 0.7,
        factors: {
          weather: 0.4,
          soilQuality: 0.6,
          pastPerformance: 0.7,
        },
      }
    }
  },

  // Predict sustainability improvements
  predictSustainabilityImprovements: async (metricId: string): Promise<SustainabilityPrediction> => {
    try {
      // In a real app, fetch historical data from API
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sustainability/${metricId}`)
      const metricData = response.data

      // For demo purposes, generate some mock data if API fails
      const mockCurrentValue = 65 + Math.random() * 20
      const mockImprovement = 5 + Math.random() * 15

      const currentValue = metricData?.currentValue || mockCurrentValue
      const predictedValue = currentValue + mockImprovement
      const improvementPercentage = ((predictedValue - currentValue) / currentValue) * 100

      // Generate recommendations based on metric type
      const recommendations = [
        "Implement drip irrigation to reduce water usage",
        "Use organic fertilizers to improve soil health",
        "Install solar panels to reduce energy consumption",
        "Implement crop rotation to reduce pest pressure",
      ]

      return {
        metricId,
        metricName: metricData?.name || "Sustainability Metric",
        currentValue: Math.round(currentValue * 10) / 10,
        predictedValue: Math.round(predictedValue * 10) / 10,
        improvementPercentage: Math.round(improvementPercentage * 10) / 10,
        recommendations: recommendations.slice(0, 2 + Math.floor(Math.random() * 3)),
      }
    } catch (error) {
      console.error("Error predicting sustainability improvements:", error)

      // Return fallback prediction
      return {
        metricId,
        metricName: "Unknown Metric",
        currentValue: 70,
        predictedValue: 85,
        improvementPercentage: 21.4,
        recommendations: [
          "Implement drip irrigation to reduce water usage",
          "Use organic fertilizers to improve soil health",
        ],
      }
    }
  },

  // Predict water usage optimization
  predictWaterUsageOptimization: async (farmId: string): Promise<WaterUsagePrediction> => {
    try {
      // In a real app, fetch historical data from API
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/farms/${farmId}/water-usage`)
      const waterData = response.data

      // For demo purposes, generate some mock data if API fails
      const mockCurrentUsage = 1000 + Math.random() * 500
      const mockSavings = 50 + Math.random() * 150

      const currentUsage = waterData?.currentUsage || mockCurrentUsage
      const predictedUsage = currentUsage - mockSavings
      const savingsPercentage = ((currentUsage - predictedUsage) / currentUsage) * 100

      // Generate recommendations
      const recommendations = [
        "Install soil moisture sensors to optimize irrigation",
        "Implement rainwater harvesting systems",
        "Use mulch to reduce evaporation",
        "Schedule irrigation during early morning or evening",
      ]

      return {
        farmId,
        currentUsage: Math.round(currentUsage),
        predictedUsage: Math.round(predictedUsage),
        savingsPercentage: Math.round(savingsPercentage * 10) / 10,
        recommendations: recommendations.slice(0, 2 + Math.floor(Math.random() * 3)),
      }
    } catch (error) {
      console.error("Error predicting water usage:", error)

      // Return fallback prediction
      return {
        farmId,
        currentUsage: 1200,
        predictedUsage: 1020,
        savingsPercentage: 15,
        recommendations: [
          "Install soil moisture sensors to optimize irrigation",
          "Implement rainwater harvesting systems",
        ],
      }
    }
  },

  // Predict pest risk
  predictPestRisk: async (input: PestRiskPredictionInput): Promise<PestRiskPrediction> => {
    const riskScore = predictPestRisk(input)
    return {
      cropType: input.cropType,
      temperature: input.temperature,
      humidity: input.humidity,
      season: input.season,
      previousInfestation: input.previousInfestation,
      neighboringCrops: input.neighboringCrops,
      riskScore: riskScore,
    }
  },

  // Predict market price
  predictMarketPrice: async (input: MarketPricePredictionInput): Promise<MarketPricePrediction> => {
    const predictedPrice = predictMarketPrice(input)
    return {
      cropType: input.cropType,
      season: input.season,
      supplyLevel: input.supplyLevel,
      demandLevel: input.demandLevel,
      previousPrice: input.previousPrice,
      organicStatus: input.organicStatus,
      predictedPrice: predictedPrice,
    }
  },

  // Predict optimal harvest date
  predictHarvestDate: async (plantingDate: Date, cropType: string, temperature: number): Promise<Date> => {
    return predictHarvestDate(plantingDate, cropType, temperature)
  },
}

export default PredictionService
