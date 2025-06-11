'use client'

import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialQuery: string
}

export default function SearchBar({ onSearch, initialQuery }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery) // Sync query when URL changes
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 focus:outline-none dark:bg-gray-700"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  )
}