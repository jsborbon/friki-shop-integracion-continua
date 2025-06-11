'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import SearchBar from '@/components/SearchBar'
import ProductFilter from '@/components/ProductFilter'
import { ProductWithCategory } from '@/domain/models'
import { FaSpinner } from 'react-icons/fa'

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 1000, category: 'all' })

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/search?q=${query}`)
                if (!response.ok) throw new Error('Failed to fetch products')

                const products: ProductWithCategory[] = await response.json()

                const filteredResults = products.filter(product => (
                    product.price >= filters.minPrice &&
                    product.price <= filters.maxPrice &&
                    (filters.category === 'all' || product.category.toLowerCase() === filters.category)
                ))

                setFilteredProducts(filteredResults)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [query, filters])

    const handleSearch = (searchQuery: string) => {
        const newSearchParams = new URLSearchParams(window.location.search)
        newSearchParams.set('q', searchQuery)
        window.history.replaceState(null, '', `${window.location.pathname}?${newSearchParams.toString()}`)
    }

    return (
        <div className="container mx-auto p-8">
            {/* Pass the query to SearchBar */}
            <SearchBar onSearch={handleSearch} initialQuery={query} />

            <div className="grid md:grid-cols-[300px_1fr] gap-8">
                <aside>
                    <ProductFilter onFilterChange={setFilters} />
                </aside>

                <main>
                    {loading ? (
                        <div className="flex items-center justify-center p-8 h-64">
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <h2 className="text-xl font-semibold mb-2 text-red-500">Error</h2>
                            <p className="text-gray-600 dark:text-gray-300">{error}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <h2 className="text-xl font-semibold mb-2 text-red-500">No products found</h2>
                            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <ProductGrid products={filteredProducts} />
                    )}
                </main>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center py-8">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    )
}