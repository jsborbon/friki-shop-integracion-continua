'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrash } from 'react-icons/fa';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  // Track fallback images
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialSources: { [key: string]: string } = {};
    items.forEach((item) => {
      initialSources[item.id] = item.image || '/images/not-found.jpg';
    });
    setImageSources(initialSources);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Your cart is empty 🛒</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add some items to your cart to see them here.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105"
          >
            <Link href={`/${item.category.toLowerCase()}/${item.id}`} className="block w-full">
              <div className="relative h-40 w-full rounded-lg overflow-hidden">
                <Image
                  src={imageSources[item.id] || '/images/not-found.jpg'}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() =>
                    setImageSources((prev) => ({
                      ...prev,
                      [item.id]: '/images/not-found.jpg',
                    }))
                  }
                />
              </div>
            </Link>

            <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">${item.price.toFixed(2)}</p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                +
              </button>
            </div>

            <div className="text-lg font-bold text-gray-900 dark:text-white mt-3">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-200"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">Total: ${total.toFixed(2)}</p>
        <button
          onClick={() => alert('Checkout functionality coming soon!')}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}