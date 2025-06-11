'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import Image from 'next/image';
import { FaSpinner } from "react-icons/fa";

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: {
        id: string;
        title: string;
        price: number;
        quantity: number;
        image?: string;
    }[];
}

export default function OrdersPage() {
    const { user, isLoaded } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (!response.ok) throw new Error('Failed to fetch orders');

                const data: Order[] = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center p-8 h-64">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center space-x-3 mb-6">
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                        <FaArrowLeft className="text-xl" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                            <FaShoppingBag className="text-gray-400 text-5xl mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-6">You have not placed any orders yet.</p>
                            <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
                                            <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Items</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <Image src={item.image || '/images/not-found.jpg'} alt={item.title} width={64} height={64} className="rounded" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}