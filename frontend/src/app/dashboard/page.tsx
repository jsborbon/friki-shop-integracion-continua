'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaUser, FaShoppingBag, FaHeart, FaSignOutAlt, FaSpinner, FaCogs, FaChevronRight } from 'react-icons/fa';
import { SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Order } from '@/domain/models';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImageSrc] = useState<string>('/images/not-found.jpg');
  const [role, setRole] = useState<string>('user');

  useEffect(() => {
    if (isLoaded && user?.imageUrl) {
      setImageSrc(user.imageUrl);
      if (user.publicMetadata?.role) {
        setRole(user.publicMetadata.role as string);
      }
    }
  }, [isLoaded, user, user?.imageUrl]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      setRecentOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center space-x-4">
          <Image
            src={imgSrc}
            alt="Profile"
            className="w-16 h-16 rounded-full border border-gray-200"
            width={64}
            height={64}
            onError={() => setImageSrc('/images/not-found.jpg')}
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome, {user?.firstName || 'User'}!
            </h2>
            <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center space-x-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">
              <FaUser className="text-blue-500 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <p className="text-gray-600">Manage your account details</p>
            </div>
          </Link>

          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center space-x-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">
              <FaShoppingBag className="text-green-500 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
              <p className="text-gray-600">View your order history</p>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center space-x-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">
              <FaHeart className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Wishlist</h3>
              <p className="text-gray-600">View your saved items</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>

          {loading ? (
            <div className="flex justify-center items-center py-4">
              <FaSpinner className="animate-spin text-gray-500 text-2xl" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order: Order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              You have not placed any orders yet.
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Actions</h2>

          <div className="space-y-5">
            {role === 'admin' && (
              <Link
                href="/admin"
                className="group block bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 hover:shadow-md transition duration-300 border border-purple-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <FaCogs className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition duration-300">Admin Panel</h3>
                    <p className="text-gray-600">Manage the shop and settings</p>
                  </div>
                  <div className="ml-auto">
                    <FaChevronRight className="text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            )}

            <div className="pt-4 border-t border-gray-100 mt-4">
              <SignOutButton>
                <button className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition duration-300 group w-full py-2">
                  <div className="bg-gray-100 p-2 rounded-full group-hover:bg-red-50 transition duration-300">
                    <FaSignOutAlt className="text-gray-500 group-hover:text-red-500 transition duration-300" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}