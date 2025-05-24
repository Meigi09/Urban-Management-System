"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

export interface SearchResult {
  id: string
  title: string
  description: string
  type: 'page' | 'tab' | 'content' | 'action'
  category: string
  path: string
  icon?: string
  keywords: string[]
  priority: number
}

// Explicit export for better compatibility
export type { SearchResult }

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  searchResults: SearchResult[]
  isSearching: boolean
  performSearch: (query: string) => void
  navigateToResult: (result: SearchResult) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// Comprehensive search index for all pages, tabs, and content
const searchIndex: SearchResult[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main dashboard with business overview and AI predictions',
    type: 'page',
    category: 'Navigation',
    path: '/dashboard',
    icon: 'BarChart',
    keywords: ['dashboard', 'overview', 'home', 'main', 'summary', 'business', 'ai', 'predictions'],
    priority: 10
  },
  {
    id: 'dashboard-overview',
    title: 'Overview Tab',
    description: 'Dashboard overview with key metrics and recent activities',
    type: 'tab',
    category: 'Dashboard',
    path: '/dashboard?tab=overview',
    keywords: ['overview', 'metrics', 'recent', 'activities', 'summary'],
    priority: 8
  },
  {
    id: 'dashboard-predictions',
    title: 'AI Predictions Tab',
    description: 'AI-powered predictions for yield, water usage, pest risk, and market prices',
    type: 'tab',
    category: 'Dashboard',
    path: '/dashboard?tab=predictions',
    keywords: ['ai', 'predictions', 'yield', 'water', 'pest', 'market', 'price', 'forecast'],
    priority: 9
  },
  {
    id: 'dashboard-analytics',
    title: 'Analytics Tab',
    description: 'Farm performance analytics and resource utilization',
    type: 'tab',
    category: 'Dashboard',
    path: '/dashboard?tab=analytics',
    keywords: ['analytics', 'performance', 'resource', 'utilization', 'charts'],
    priority: 8
  },
  {
    id: 'dashboard-reports',
    title: 'Reports Tab',
    description: 'Financial and sustainability reports',
    type: 'tab',
    category: 'Dashboard',
    path: '/app/dashboard?tab=reports',
    keywords: ['reports', 'financial', 'sustainability', 'revenue', 'costs'],
    priority: 7
  },

  // Farms
  {
    id: 'farms',
    title: 'Farms Management',
    description: 'Manage urban farms, track performance, and assign staff',
    type: 'page',
    category: 'Management',
    path: '/app/farms',
    icon: 'Leaf',
    keywords: ['farms', 'farming', 'agriculture', 'manage', 'urban', 'location', 'area'],
    priority: 10
  },
  {
    id: 'farms-new',
    title: 'Add New Farm',
    description: 'Create a new urban farm',
    type: 'action',
    category: 'Farms',
    path: '/app/farms/new',
    keywords: ['add', 'new', 'create', 'farm', 'register'],
    priority: 8
  },

  // Crops
  {
    id: 'crops',
    title: 'Crops Management',
    description: 'Track crop lifecycle, growing conditions, and harvest schedules',
    type: 'page',
    category: 'Management',
    path: '/app/crops',
    icon: 'Sprout',
    keywords: ['crops', 'plants', 'growing', 'harvest', 'lifecycle', 'vegetables', 'fruits'],
    priority: 10
  },
  {
    id: 'crops-new',
    title: 'Track New Crop',
    description: 'Start tracking a new crop',
    type: 'action',
    category: 'Crops',
    path: '/app/crops/new',
    keywords: ['track', 'new', 'crop', 'plant', 'seed'],
    priority: 8
  },

  // Staff
  {
    id: 'staff',
    title: 'Staff & Volunteers',
    description: 'Manage staff, volunteers, and task assignments',
    type: 'page',
    category: 'Management',
    path: '/app/staff',
    icon: 'Users',
    keywords: ['staff', 'volunteers', 'employees', 'workers', 'team', 'personnel', 'tasks'],
    priority: 9
  },
  {
    id: 'staff-new',
    title: 'Add Staff Member',
    description: 'Add a new staff member or volunteer',
    type: 'action',
    category: 'Staff',
    path: '/app/staff/new',
    keywords: ['add', 'new', 'staff', 'volunteer', 'employee', 'hire'],
    priority: 7
  },

  // Inventory
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Track produce inventory, freshness, and stock levels',
    type: 'page',
    category: 'Management',
    path: '/app/inventory',
    icon: 'Package',
    keywords: ['inventory', 'stock', 'produce', 'freshness', 'storage', 'warehouse'],
    priority: 9
  },
  {
    id: 'inventory-new',
    title: 'Add Inventory Item',
    description: 'Add new produce to inventory',
    type: 'action',
    category: 'Inventory',
    path: '/app/inventory/new',
    keywords: ['add', 'new', 'inventory', 'stock', 'produce'],
    priority: 7
  },

  // Orders
  {
    id: 'orders',
    title: 'Orders Management',
    description: 'Process customer orders and track deliveries',
    type: 'page',
    category: 'Management',
    path: '/app/orders',
    icon: 'ShoppingCart',
    keywords: ['orders', 'customers', 'sales', 'delivery', 'fulfillment', 'purchase'],
    priority: 9
  },
  {
    id: 'orders-new',
    title: 'Create New Order',
    description: 'Create a new customer order',
    type: 'action',
    category: 'Orders',
    path: '/app/orders/new',
    keywords: ['create', 'new', 'order', 'sale', 'customer'],
    priority: 7
  },

  // Clients
  {
    id: 'clients',
    title: 'Clients Management',
    description: 'Manage customer relationships and preferences',
    type: 'page',
    category: 'Management',
    path: '/app/clients',
    icon: 'User',
    keywords: ['clients', 'customers', 'relationships', 'preferences', 'contacts'],
    priority: 8
  },
  {
    id: 'clients-new',
    title: 'Add New Client',
    description: 'Add a new client to the system',
    type: 'action',
    category: 'Clients',
    path: '/app/clients/new',
    keywords: ['add', 'new', 'client', 'customer', 'contact'],
    priority: 6
  },

  // Sustainability
  {
    id: 'sustainability',
    title: 'Sustainability Metrics',
    description: 'Track environmental impact and sustainability goals',
    type: 'page',
    category: 'Management',
    path: '/app/sustainability',
    icon: 'Leaf',
    keywords: ['sustainability', 'environment', 'green', 'eco', 'carbon', 'water', 'energy'],
    priority: 8
  },
  {
    id: 'sustainability-new',
    title: 'Add Sustainability Metric',
    description: 'Track new sustainability metric',
    type: 'action',
    category: 'Sustainability',
    path: '/app/sustainability/new',
    keywords: ['add', 'new', 'sustainability', 'metric', 'environment'],
    priority: 6
  },

  // Settings
  {
    id: 'settings',
    title: 'Settings',
    description: 'System settings and user preferences',
    type: 'page',
    category: 'System',
    path: '/app/settings',
    icon: 'Settings',
    keywords: ['settings', 'preferences', 'configuration', 'system', 'profile'],
    priority: 6
  },

  // Common actions and features
  {
    id: 'search',
    title: 'Global Search',
    description: 'Search across all pages and content',
    type: 'action',
    category: 'System',
    path: '/?search=true',
    keywords: ['search', 'find', 'look', 'query'],
    priority: 5
  },
  {
    id: 'logout',
    title: 'Logout',
    description: 'Sign out of the system',
    type: 'action',
    category: 'System',
    path: '/logout',
    keywords: ['logout', 'sign out', 'exit', 'leave'],
    priority: 4
  }
]

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate search delay for better UX
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim()
      const results = searchIndex
        .filter(item => {
          // Search in title, description, and keywords
          const searchText = [
            item.title,
            item.description,
            ...item.keywords
          ].join(' ').toLowerCase()

          return searchText.includes(normalizedQuery)
        })
        .sort((a, b) => {
          // Sort by priority and relevance
          const aRelevance = calculateRelevance(a, normalizedQuery)
          const bRelevance = calculateRelevance(b, normalizedQuery)

          if (aRelevance !== bRelevance) {
            return bRelevance - aRelevance
          }

          return b.priority - a.priority
        })
        .slice(0, 10) // Limit to top 10 results

      setSearchResults(results)
      setIsSearching(false)
    }, 200)
  }

  const calculateRelevance = (item: SearchResult, query: string): number => {
    let score = 0

    // Exact title match gets highest score
    if (item.title.toLowerCase() === query) {
      score += 100
    } else if (item.title.toLowerCase().includes(query)) {
      score += 50
    }

    // Description match
    if (item.description.toLowerCase().includes(query)) {
      score += 25
    }

    // Keywords match
    const matchingKeywords = item.keywords.filter(keyword =>
      keyword.toLowerCase().includes(query)
    )
    score += matchingKeywords.length * 10

    // Boost score for exact keyword matches
    if (item.keywords.some(keyword => keyword.toLowerCase() === query)) {
      score += 30
    }

    return score
  }

  const navigateToResult = (result: SearchResult) => {
    setIsSearchOpen(false)
    setSearchQuery("")

    if (result.path.includes('?tab=')) {
      const [path, params] = result.path.split('?')
      navigate(path)
      // Handle tab switching if needed
      const urlParams = new URLSearchParams(params)
      const tab = urlParams.get('tab')
      if (tab) {
        // Trigger tab change after navigation
        setTimeout(() => {
          const tabElement = document.querySelector(`[data-value="${tab}"]`) as HTMLElement
          if (tabElement) {
            tabElement.click()
          }
        }, 100)
      }
    } else {
      navigate(result.path)
    }
  }

  // Auto-search when query changes
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        searchResults,
        isSearching,
        performSearch,
        navigateToResult,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
