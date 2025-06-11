"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/domain/models";
import { FaSpinner } from "react-icons/fa";
import { fetchFromAPI } from '@/services/api';

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to handle image fallbacks
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await fetchFromAPI('/sections');
        setSections(data as Section[]);

        // Initialize imageSources with default images
        const initialSources: { [key: string]: string } = {};
        (data as Section[]).forEach((item: Section) => {
          initialSources[item.id] = item.image;
        });
        setImageSources(initialSources);
      } catch (err) {
        console.error("Error fetching sections:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

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
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className="text-blue-400">Friki Zone</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-xl shadow-xl bg-gray-800 group"
            >
              <Link href={section.link} className="block">
                <div className="relative h-72 w-full">
                  <Image
                    src={imageSources[section.id] || "/images/not-found.jpg"}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => {
                      setImageSources((prev) => ({
                        ...prev,
                        [section.id]: "/images/not-found.jpg",
                      }));
                    }}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 p-6 w-full text-center">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">{section.title}</h2>
                  <p className="text-gray-300 mt-2 text-lg drop-shadow-md">{section.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}