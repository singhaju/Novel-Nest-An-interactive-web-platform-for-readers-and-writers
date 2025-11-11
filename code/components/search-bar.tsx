"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  novel_id: number
  title: string
  author?: {
    username: string
  }
  cover_image?: string
  status: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          if (res.ok) {
            const data = await res.json()
            setResults(data.results || [])
            setShowResults(true)
          }
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/novels?search=${encodeURIComponent(query)}`)
      setShowResults(false)
      setQuery("")
    }
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search novels by title, author, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            className="w-full rounded-full bg-muted px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-background shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((novel) => (
                <Link
                  key={novel.novel_id}
                  href={`/novel/${novel.novel_id}`}
                  onClick={() => {
                    setShowResults(false)
                    setQuery("")
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden flex-shrink-0">
                    {novel.cover_image ? (
                      <img
                        src={novel.cover_image}
                        alt={novel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{novel.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {novel.author?.username || "Unknown Author"}
                    </p>
                    <span className="text-xs text-muted-foreground capitalize">{novel.status.toLowerCase()}</span>
                  </div>
                </Link>
              ))}
              <div className="p-3 text-center border-t border-border">
                <button
                  onClick={handleSubmit}
                  className="text-sm text-primary hover:underline"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No novels found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
