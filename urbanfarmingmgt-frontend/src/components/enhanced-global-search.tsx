"use client"

import { useState, useEffect } from "react"
import { Search, X, ArrowRight, Hash, FileText, Settings, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/contexts/search-context"
import type { SearchResult } from "@/contexts/search-context"

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4" />
    case 'tab':
      return <Hash className="h-4 w-4" />
    case 'action':
      return <Zap className="h-4 w-4" />
    case 'content':
      return <FileText className="h-4 w-4" />
    default:
      return <Settings className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'page':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'tab':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'action':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'content':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export default function EnhancedGlobalSearch() {
  const {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    searchResults,
    isSearching,
    navigateToResult
  } = useSearch()

  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
      }

      if (isSearchOpen && searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % searchResults.length)
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
        }
        if (e.key === "Enter") {
          e.preventDefault()
          if (searchResults[selectedIndex]) {
            navigateToResult(searchResults[selectedIndex])
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen, searchResults, selectedIndex, setIsSearchOpen, setSearchQuery, navigateToResult])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults])

  const handleResultClick = (result: SearchResult) => {
    navigateToResult(result)
  }

  if (!isSearchOpen) {
    return (
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search everything...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex items-center space-x-2 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search pages, tabs, actions, and content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          )}

          {searchResults.length > 0 && !isSearching && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
              <div className="space-y-1">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex cursor-pointer items-center space-x-3 rounded-md p-3 transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex-shrink-0">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium truncate">{result.title}</div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {result.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.category}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="py-8 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                No results found for "{searchQuery}"
              </div>
              <div className="text-xs text-muted-foreground">
                Try searching for pages, tabs, or actions like "dashboard", "farms", "add crop"
              </div>
            </div>
          )}

          {!searchQuery && !isSearching && (
            <div className="p-4">
              <div className="text-sm font-medium mb-3">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-muted-foreground mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Enter</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
