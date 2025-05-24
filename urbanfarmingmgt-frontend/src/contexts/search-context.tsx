import { createContext, useContext, useState, type ReactNode } from "react"

interface SearchContextType {
  globalQuery: string
  setGlobalQuery: (query: string) => void
  searchResults: any[]
  setSearchResults: (results: any[]) => void
  isSearching: boolean
  setIsSearching: (isSearching: boolean) => void
  performGlobalSearch: (query: string) => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [globalQuery, setGlobalQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performGlobalSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setGlobalQuery(query)

    try {
      // In a real app, this would be an actual API call to search across all entities
      // For demo purposes, we'll simulate search results
      const results = [
        { id: 1, type: "farm", name: "Green Valley Farm", description: "Organic vegetable farm" },
        { id: 2, type: "crop", name: "Tomatoes", description: "Summer crop" },
        { id: 3, type: "client", name: "John Smith", description: "Regular customer" },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )

      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <SearchContext.Provider
      value={{
        globalQuery,
        setGlobalQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        performGlobalSearch,
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
