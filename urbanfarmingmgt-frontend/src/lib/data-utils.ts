/**
 * Utility functions for handling API data and preventing common errors
 */

/**
 * Safely handles API responses and provides fallback data
 */
export function safeApiResponse<T>(response: any, fallbackData: T[]): T[] {
  if (!response || !response.data) {
    return fallbackData
  }

  return Array.isArray(response.data) ? response.data : fallbackData
}

/**
 * Ensures array fields are properly formatted
 */
export function ensureArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value
  }
  if (value === null || value === undefined) {
    return []
  }
  return [value]
}

/**
 * Provides safe string fallback
 */
export function safeString(value: any, fallback: string = 'Unknown'): string {
  if (typeof value === 'string' && value.trim()) {
    return value
  }
  return fallback
}

/**
 * Provides safe number fallback
 */
export function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value)
  return isNaN(num) ? fallback : num
}

/**
 * Formats date for display
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Formats currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

/**
 * Handles errors gracefully for presentation mode
 */
export function handleApiError(error: any, context: string) {
  console.error(`Error in ${context}:`, error)

  // Only show error toasts in production or non-localhost environments
  const isDemo = window.location.hostname.includes('localhost') ||
                 window.location.hostname.includes('127.0.0.1')

  return !isDemo
}
