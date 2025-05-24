import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/contexts/search-context"

interface GlobalSearchProps {
  onClose: () => void
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const { searchResults, isSearching, globalQuery } = useSearch()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const getItemLink = (item: any) => {
    switch (item.type) {
      case "farm":
        return `/farms/${item.id}`
      case "crop":
        return `/crops/${item.id}`
      case "client":
        return `/clients/${item.id}`
      case "harvest":
        return `/harvests/${item.id}`
      case "inventory":
        return `/inventory/${item.id}`
      case "order":
        return `/orders/${item.id}`
      case "staff":
        return `/staff/${item.id}`
      default:
        return "/"
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "farm":
        return "🏡"
      case "crop":
        return "🌱"
      case "client":
        return "👤"
      case "harvest":
        return "🌾"
      case "inventory":
        return "📦"
      case "order":
        return "🛒"
      case "staff":
        return "👷"
      default:
        return "📄"
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-16 left-0 right-0 z-50 mx-4 mt-2 rounded-lg border bg-card shadow-lg md:left-auto md:right-4 md:w-96"
    >
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Search Results</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[60vh] overflow-auto p-4">
        {isSearching ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <ul className="space-y-2">
            {searchResults.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  to={getItemLink(item)}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                  onClick={onClose}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getItemIcon(item.type)}
                  </span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            {globalQuery ? <p>No results found for "{globalQuery}"</p> : <p>Start typing to search</p>}
          </div>
        )}
      </div>
    </div>
  )
}
