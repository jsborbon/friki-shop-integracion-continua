'use client'

import { useWishlist } from '@/context/WishlistContext'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa'

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()

  // State to track fallback images per item
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});

  // Populate `imageSources` when items are loaded
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Your wishlist is empty
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add some items to your wishlist to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Your Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col items-center text-center"
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
              <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">${item.price.toFixed(2)}</p>
            </Link>

            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-200"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}