"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaSpinner, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ProductWithCategory, Category } from "@/domain/models";
import PageSizeSelector from "@/components/PageSizeSelector";

export default function AdminProductsPage() {
    const { isLoaded } = useUser();

    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Get unique categories for filter dropdown
    const categories: Category[] = [
        "ANIME",
        "COMICS",
        "GAMING",
        "MERCHANDISE",
        "COLLECTIBLES",
        "BOARD_GAMES",
        "MANGA",
        "MOVIES",
        "COSPLAY",
    ];

    // Column filters and sorting
    const [filters, setFilters] = useState({
        name: "",
        category: "",
        price: { min: "", max: "" }
    });
    const [sortConfig, setSortConfig] = useState({
        key: "title",
        direction: "asc"
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                fetch(`/api/products?category=ANIME&page=${page}&pageSize=${pageSize}`)

                const res = await fetch(`/api/products?${filters.category ? 'category=' + filters.category + '&' : ''}page=${page}&pageSize=${pageSize}`);

                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();

                if (Array.isArray(data)) {
                    setProducts(data);
                    setHasMoreItems(data.length === pageSize);
                } else {
                    setProducts(data.products || []);
                    setHasMoreItems(data.products.length === pageSize);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, pageSize, filters.category]);

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/admin/products/${productId}`, {
                    method: "DELETE",
                });

                if (!res.ok) throw new Error("Failed to delete product");

                setProducts(products.filter((product) => product.id.toString() !== productId));
                alert("Product deleted successfully");
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete product");
            }
        }
    };

    const handleSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const resetFilters = () => {
        setFilters({
            name: "",
            category: "",
            price: { min: "", max: "" }
        });
        setShowFilters(false);
    };

    // Apply filters and sorting
    const filteredAndSortedProducts = products
        .filter(product =>
            // Global search
            (searchTerm === "" ||
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
            // Column specific filters
            (filters.name === "" ||
                product.title.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.category === "" ||
                product.category.toLowerCase().includes(filters.category.toLowerCase())) &&
            (filters.price.min === "" || product.price >= parseFloat(filters.price.min)) &&
            (filters.price.max === "" || product.price <= parseFloat(filters.price.max))
        )
        .sort((a, b) => {
            if (sortConfig.key === 'price') {
                return sortConfig.direction === 'asc'
                    ? a.price - b.price
                    : b.price - a.price;
            } else {
                const aValue = a[sortConfig.key as keyof ProductWithCategory];
                const bValue = b[sortConfig.key as keyof ProductWithCategory];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return 0;
            }
        });

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center p-8 h-64">
                <FaSpinner className="animate-spin text-3xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 transition duration-200">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-indigo-900">Manage Products</h1>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-200 transition duration-200 shadow-sm"
                        >
                            <FaFilter />
                            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                        </button>
                        <Link
                            href="/admin/products/new"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:from-emerald-600 hover:to-teal-600 transition duration-200 shadow-md"
                        >
                            <FaPlus />
                            <span>Add New Product</span>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 h-64 bg-white rounded-xl shadow-lg">
                        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
                        <p className="text-indigo-800 font-medium">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <p className="text-red-500 font-medium text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                                <div className="relative w-full md:w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-2.5 text-indigo-400" />
                                </div>
                            </div>

                            {/* Advanced Filters Panel */}
                            {showFilters && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium text-indigo-800">Advanced Filters</h3>
                                        <button
                                            onClick={resetFilters}
                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            Reset All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                value={filters.name}
                                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                                placeholder="Filter by name..."
                                                className="w-full p-2 rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={filters.category}
                                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                                className="w-full p-2 rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={filters.price.min}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        price: { ...filters.price, min: e.target.value }
                                                    })}
                                                    placeholder="Min"
                                                    className="w-1/2 p-2 rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                                <span className="text-gray-500">-</span>
                                                <input
                                                    type="number"
                                                    value={filters.price.max}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        price: { ...filters.price, max: e.target.value }
                                                    })}
                                                    placeholder="Max"
                                                    className="w-1/2 p-2 rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-indigo-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('title')}
                                                className="flex items-center space-x-1 group focus:outline-none"
                                            >
                                                <span>Name</span>
                                                {sortConfig.key === 'title' ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <FaSortAmountUp className="text-indigo-600" />
                                                    ) : (
                                                        <FaSortAmountDown className="text-indigo-600" />
                                                    )
                                                ) : (
                                                    <FaSortAmountUp className="text-gray-300 group-hover:text-indigo-600" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('category')}
                                                className="flex items-center space-x-1 group focus:outline-none"
                                            >
                                                <span>Category</span>
                                                {sortConfig.key === 'category' ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <FaSortAmountUp className="text-indigo-600" />
                                                    ) : (
                                                        <FaSortAmountDown className="text-indigo-600" />
                                                    )
                                                ) : (
                                                    <FaSortAmountUp className="text-gray-300 group-hover:text-indigo-600" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('price')}
                                                className="flex items-center space-x-1 group focus:outline-none"
                                            >
                                                <span>Price</span>
                                                {sortConfig.key === 'price' ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <FaSortAmountUp className="text-indigo-600" />
                                                    ) : (
                                                        <FaSortAmountDown className="text-indigo-600" />
                                                    )
                                                ) : (
                                                    <FaSortAmountUp className="text-gray-300 group-hover:text-indigo-600" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredAndSortedProducts.length > 0 ? (
                                        filteredAndSortedProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-indigo-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-indigo-100">
                                                        <Image
                                                            src={product.image || "/images/default-placeholder.jpg"}
                                                            width={48}
                                                            height={48}
                                                            quality={75}
                                                            alt={product.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border border-indigo-200">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-emerald-600">${product.price.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-4">
                                                        <Link
                                                            href={`/admin/products/edit/${product.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full transition duration-200"
                                                            title="Edit Product"
                                                        >
                                                            <FaEdit className="text-lg" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id.toString())}
                                                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition duration-200"
                                                            title="Delete Product"
                                                        >
                                                            <FaTrash className="text-lg" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <p className="text-gray-500 font-medium">No products found matching your criteria</p>
                                                    {(searchTerm || filters.name || filters.category || filters.price.min || filters.price.max) && (
                                                        <button
                                                            onClick={() => {
                                                                setSearchTerm("");
                                                                resetFilters();
                                                            }}
                                                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                                                        >
                                                            Clear all filters
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Results Summary */}
                        <div className="px-6 py-2 bg-indigo-50 border-t border-b border-indigo-100 text-sm text-indigo-700">
                            Showing {filteredAndSortedProducts.length} of {products.length} products
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-100">
                            <div className="mb-4 md:mb-0">
                                <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    className={`px-4 py-2 rounded-md ${page === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                                        }`}
                                >
                                    Previous
                                </button>

                                <span className="flex items-center px-4 py-2 bg-white rounded-md shadow-sm border border-indigo-100 text-indigo-800">
                                    Page {page}
                                </span>

                                <button
                                    disabled={!hasMoreItems}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className={`px-4 py-2 rounded-md ${!hasMoreItems
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}