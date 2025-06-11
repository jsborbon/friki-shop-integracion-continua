'use client'

import { useEffect, useState } from 'react'
import { Section } from "@/domain/models";
import { FaSpinner } from "react-icons/fa";
import { fetchFromAPI } from '@/services/api';


interface ProductFilterProps {
  onFilterChange: (filters: FilterValues) => void
}

interface FilterValues {
  minPrice: number
  maxPrice: number
  category: string
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([])
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: 0,
    maxPrice: 1000,
    category: 'all'
  })


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await fetchFromAPI('/sections');
        setSections(data as Section[]);
      } catch (err) {
        console.error("Error fetching sections:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleFilterChange = (key: keyof FilterValues, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <h2 className="text-2xl font-bold">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Categories</option>
            {
              sections.map((section) => (
                <option key={section.id} value={section.title.toLowerCase()}>{section.title}</option>
              ))
            }
            <option value="anime">Anime</option>
            <option value="comics">Comics</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              min="0"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Min"
            />
            <span>to</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              min="0"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  )
}