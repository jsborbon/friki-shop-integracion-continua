"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BoardGamesProduct } from "@/domain/models";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BoardGamesPage() {
  const [boardGamesList, setBoardGamesList] = useState<BoardGamesProduct[]>([]);
  // State to track image fallbacks
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=BOARD_GAMES&page=${page}&pageSize=${pageSize}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch board games data");
        return res.json();
      })
      .then((data: BoardGamesProduct[]) => {
        setBoardGamesList(data);
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
        console.error("Error fetching board games products:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

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
      <h1 className="text-4xl font-bold mb-8">Board Games Zone</h1>

      {/* Product List */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {boardGamesList.map((boardGame) => (
          <motion.div
            key={boardGame.id}
            onClick={() => router.push(`/board-games/${boardGame.id}`)}
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
                src={imageSources[boardGame.id] || "/images/not-found.jpg"}
                alt={boardGame.title}
                fill
                className="object-cover"
                onError={() => {
                  setImageSources((prev) => ({
                    ...prev,
                    [boardGame.id]: "/images/not-found.jpg",
                  }));
                }}
                unoptimized
              />
            </motion.div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{boardGame.title}</h2>
              <h3 className="text-lg font-semibold mb-2 text-gray-500">${boardGame.price}</h3>
              <p className="text-gray-600 dark:text-gray-300">{boardGame.description}</p>
              {boardGame.metadata && (
                <ul className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                  {boardGame.metadata.players && <li><strong>Players:</strong> {boardGame.metadata.players}</li>}
                  {boardGame.metadata.playTime && <li><strong>Play Time:</strong> {boardGame.metadata.playTime}</li>}
                  {boardGame.metadata.complexity && <li><strong>Complexity:</strong> {boardGame.metadata.complexity}</li>}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <motion.div
        className="flex justify-center mt-8 space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
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
          disabled={!hasMoreItems}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md ${!hasMoreItems ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400 dark:hover:bg-gray-600"}`}
          whileHover={{ scale: hasMoreItems ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </motion.div>
    </motion.div>
  );
}