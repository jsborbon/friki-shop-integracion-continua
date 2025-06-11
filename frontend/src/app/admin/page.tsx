"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { FaSpinner, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { fetchFromAPI } from '@/services/api';


export default function AdminDashboard() {
    const { isLoaded } = useUser();

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchFromAPI('/admin/stats');

            setStats({
                totalProducts: (data as { totalProducts?: number }).totalProducts || 0,
                totalUsers: (data as { totalUsers?: number }).totalUsers || 0,
                totalOrders: (data as { totalOrders?: number }).totalOrders || 0,
                revenue: (data as { revenue?: number }).revenue || 0
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
                {loading ? (
                    <div className="flex items-center justify-center p-8 h-64">
                        <FaSpinner className="animate-spin text-3xl text-blue-500" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Total Products", value: stats.totalProducts, color: "blue" },
                            { label: "Total Users", value: stats.totalUsers, color: "green" },
                            { label: "Total Orders", value: stats.totalOrders, color: "yellow" },
                            { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "red" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className={`p-6 rounded-lg shadow-md bg-${color}-100 border-l-4 border-${color}-500`}>
                                <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
                                <p className="text-3xl font-bold text-gray-900">{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón para ir a la gestión de productos */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/admin/products"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-md transition-all"
                    >
                        <FaBoxOpen className="text-xl" />
                        <span>Manage Products</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
