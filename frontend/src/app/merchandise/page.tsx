"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MerchandiseProduct } from "@/domain/models";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import PageSizeSelector from "@/components/PageSizeSelector";

export default function MerchandisePage() {
  const [merchandiseList, setMerchandiseList] = useState<MerchandiseProduct[]>([]);
  // State to track image fallbacks
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=MERCHANDISE&page=${page}&pageSize=${pageSize}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch merchandise data");
        return res.json();
      })
      .then((data: MerchandiseProduct[]) => {
        setMerchandiseList(data);
        // Check if we have fewer items than the page size, which means we've reached the end
        setHasMoreItems(data.length === pageSize);

        // Initialize the imageSources state with default images
        const initialSources: { [key: string]: string } = {};
        data.forEach((item) => {
          initialSources[item.id] = item.image;
        });
        setImageSources(initialSources);
      })
      .catch((err) => {
        console.error("Error fetching merchandise products:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, pageSize]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-8 text-center"
      >
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8"
    >
      <h1 className="text-4xl font-bold mb-8">Merchandise Zone</h1>

      {/* Product List */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merchandiseList.map((merchandise) => (
          <motion.div
            key={merchandise.id}
            onClick={() => router.push(`/merchandise/${merchandise.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative h-48 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={imageSources[merchandise.id] || "/images/not-found.jpg"}
                alt={merchandise.title}
                fill
                className="object-cover"
                onError={() => {
                  setImageSources((prev) => ({
                    ...prev,
                    [merchandise.id]: "/images/not-found.jpg",
                  }));
                }}
                unoptimized
              />
            </motion.div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{merchandise.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{merchandise.description}</p>
              {merchandise.metadata && (
                <ul className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                  {merchandise.metadata.size && <li><strong>Size:</strong> {merchandise.metadata.size}</li>}
                  {merchandise.metadata.material && <li><strong>Material:</strong> {merchandise.metadata.material}</li>}
                  {merchandise.metadata.brand && <li><strong>Brand:</strong> {merchandise.metadata.brand}</li>}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <motion.div
        className="flex justify-between items-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />

        <div className="flex space-x-4">
          <motion.button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className={`px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
            whileHover={{ scale: page === 1 ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>

          <motion.button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMoreItems}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md ${!hasMoreItems ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            whileHover={{ scale: hasMoreItems ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}