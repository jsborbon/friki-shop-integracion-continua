"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaImage, FaTag, FaDollarSign, FaListUl } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchFromAPI } from '@/services/api';


export default function NewProductPage() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    metadata: {},
  });

  const [imageSrc, setImageSrc] = useState<string>("/images/not-found.jpg");

  const categories = [
    { value: "MERCHANDISE", label: "Merchandise" },
    { value: "COLLECTIBLES", label: "Collectibles" },
    { value: "COMICS", label: "Comics" },
    { value: "MANGA", label: "Manga" },
    { value: "ANIME", label: "Anime" },
    { value: "MOVIES", label: "Movies" },
    { value: "GAMING", label: "Gaming" },
    { value: "BOARD_GAMES", label: "Board Games" },
    { value: "COSPLAY", label: "Cosplay" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageSrc(value); // Update image preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchFromAPI("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!data || typeof data !== 'object' || !('ok' in data) || !data.ok) throw new Error("Failed to create product");

      router.push("/admin/products");
      alert("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-gray-600 font-medium">Loading product form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link href="/admin/products" className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:text-blue-800 hover:shadow-lg transition duration-300 mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 bg-white px-6 py-3 rounded-xl shadow-md">
            Add New Product
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Image Preview Area */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-2 w-64 h-64 flex items-center justify-center overflow-hidden">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Product preview"
                  width={300}
                  height={300}
                  className="object-contain max-h-60 w-auto"
                  onError={() => setImageSrc("/images/not-found.jpg")}
                  unoptimized
                />
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <FaImage className="text-5xl mx-auto mb-3" />
                  <p>Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Title */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaTag className="text-blue-500 mr-2" />
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product title"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaListUl className="text-blue-500 mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Describe your product in detail"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaDollarSign className="text-blue-500 mr-2" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full pl-10 px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaListUl className="text-blue-500 mr-2" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200 appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaImage className="text-blue-500 mr-2" />
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-10 flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-300 flex items-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center space-x-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    <span>Save Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}