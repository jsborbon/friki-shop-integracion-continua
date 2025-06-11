"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaImage, FaTag, FaDollarSign, FaListUl, FaSpinner, FaCube, FaPen } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    metadata: {},
  });
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const product = await res.json();
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image || "",
          metadata: product.metadata || {},
        });
        setImageSrc(product.image || "/images/not-found.jpg");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoadingProduct(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageSrc(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      setNotification({ message: "Product updated successfully!", type: "success" });
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      console.error("Error updating product:", err);
      setNotification({ message: "Failed to update product. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 relative mb-4">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 absolute inset-0" />
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin absolute inset-0"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading product form...</p>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 relative mb-4">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 absolute inset-0" />
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin absolute inset-0"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading product data...</p>
          <p className="text-gray-500 text-sm mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <span className="text-red-500 text-3xl">×</span>
          </div>
          <p className="text-red-500 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin/products")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 transform ${notification.type === "success" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
            }`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${notification.type === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
              }`}>
              <span>{notification.type === "success" ? "✓" : "×"}</span>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${notification.type === "success" ? "text-green-800" : "text-red-800"
                }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link href="/admin/products" className="bg-white p-3 rounded-full shadow-md text-indigo-600 hover:text-indigo-800 hover:shadow-lg transition duration-300 mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md flex items-center">
            <FaPen className="text-indigo-600 mr-3 text-2xl" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
              Edit Product
            </h1>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Image Preview Area */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 flex justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-10 -top-24 w-64 h-64 bg-white rounded-full opacity-20"></div>
              <div className="absolute -left-10 -bottom-24 w-64 h-64 bg-white rounded-full opacity-20"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-3 w-72 h-72 flex items-center justify-center overflow-hidden relative z-10 transform transition-all duration-300 hover:scale-105">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Product preview"
                  width={300}
                  height={300}
                  className="object-contain max-h-64 w-auto"
                  onError={() => setImageSrc("/images/not-found.jpg")}
                  unoptimized
                />
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <FaImage className="text-6xl mx-auto mb-3" />
                  <p>Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full">
              <FaCube className="text-indigo-600 mr-2" />
              <span className="text-indigo-700 font-medium">{formData.category || "Select a category"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Title */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaTag className="text-indigo-500 mr-2" />
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product title"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaListUl className="text-indigo-500 mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Describe your product in detail"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaDollarSign className="text-indigo-500 mr-2" />
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
                    className="w-full pl-10 px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaListUl className="text-indigo-500 mr-2" />
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full appearance-none px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200 pr-10"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="col-span-2">
                <label className="flex items-center text-base font-semibold text-gray-700 mb-2">
                  <FaImage className="text-indigo-500 mr-2" />
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:-translate-y-1 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span className="font-medium text-base">Updating Product...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-xl" />
                    <span className="font-medium text-base">Save Changes</span>
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